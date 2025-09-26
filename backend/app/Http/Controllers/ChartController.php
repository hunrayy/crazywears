<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chart;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;



class ChartController extends Controller
{
    // Private method to generate cache key always based on full month range
    private function generateCacheKey($year, $monthName, Carbon $startDate, Carbon $endDate): string
    {
        $periodStr = $monthName . ' (' . $startDate->format('d-m-Y') . ' to ' . $endDate->format('d-m-Y') . ')';
        return 'chart_data_' . ($year ?: 'all') . '_' . md5($periodStr);
    }

    public function updateChartData(Request $request){
        try {
            $request->validate([
                'year' => 'nullable|integer|min:2000|max:' . Carbon::now()->year,
            ]);

            $ipAddress = $request->ip();

            
    
            $today = Carbon::today()->format('Y-m-d');  // normalized 'Y-m-d' format

            $requestedYear = $request->input('year', Carbon::now()->year);
            $currentMonth = Carbon::now()->month;

            $startOfYear = Carbon::create($requestedYear, 1, 1)->startOfDay();

            $startOfMonth = Carbon::create($requestedYear, $currentMonth, 1)->startOfDay();
            $endOfMonth = Carbon::create($requestedYear, $currentMonth, 1)->endOfMonth();

            $endOfCurrentMonth = Carbon::create($requestedYear, $currentMonth)->endOfMonth();

            $cacheKey = $this->generateCacheKey($requestedYear, $startOfMonth->format('F'), $startOfMonth, $endOfMonth);

            $cached = Cache::get($cacheKey);
    
            $ipAlreadyExists = false;
    
            // 1. Update DB
            $chart = Chart::firstOrCreate(
                ['date' => $today],
                ['ips' => [$ipAddress]]
            );
    
            if (!$chart->wasRecentlyCreated) {
                $existingIps = is_array($chart->ips) ? $chart->ips : json_decode($chart->ips, true);
                $existingIps = is_array($existingIps) ? $existingIps : [];
    
                if (!in_array($ipAddress, $existingIps)) {
                    $existingIps[] = $ipAddress;
                    $chart->ips = $existingIps;
                    $chart->save();
                } else {
                    $ipAlreadyExists = true;
                }
            }
    
            // 2. Update cache if exists
            if ($cached && isset($cached['data'], $cached['labels'], $cached['years']) && is_array($cached['data'])) {
                $data = collect($cached['data']);
    
                // Normalize dates in cache before searching
                $entryIndex = $data->search(function ($entry) use ($today) {
                    $entryDate = preg_match('/^\d{4}-\d{2}-\d{2}$/', $entry['date']) 
                        ? $entry['date'] 
                        : Carbon::createFromFormat('d-m-Y', $entry['date'])->format('Y-m-d');
                    return $entryDate === $today;
                });
    
                if ($entryIndex !== false) {
                    $ips = $data[$entryIndex]['ips'];
                    $existingIps = is_array($ips) ? $ips : json_decode($ips, true);
                    $existingIps = is_array($existingIps) ? $existingIps : [];
    
                    if (!in_array($ipAddress, $existingIps)) {
                        $existingIps[] = $ipAddress;
                    }
    
                    // Update with normalized date format
                    $data->put($entryIndex, [
                        'date' => $today,
                        'ips' => $existingIps
                    ]);
                } else {
                    // No entry for today — add new
                    $data->push([
                        'date' => $today,
                        'ips' => [$ipAddress]
                    ]);
                }
    
                // Sort by date (which are normalized), and save cache
                $cached['data'] = $data->sortBy('date')->values()->toArray();
                Cache::put($cacheKey, $cached, now()->addWeek());
            } else {
                // Cache doesn't exist — rebuild from DB
                $dataFromDb = Chart::whereBetween('date', [$startOfMonth, $endOfMonth])
                    ->orderBy('date', 'asc')
                    ->get(['date', 'ips'])
                    ->toArray();
    
                // Normalize all dates on rebuild to 'Y-m-d'
                $dataFromDb = collect($dataFromDb)->map(function ($item) {
                    $item['date'] = preg_match('/^\d{4}-\d{2}-\d{2}$/', $item['date']) 
                        ? $item['date'] 
                        : Carbon::createFromFormat('d-m-Y', $item['date'])->format('Y-m-d');
                    return $item;
                })->toArray();
    
                $labels = $this->buildLabelsForMonth($requestedYear, $startOfYear, $endOfCurrentMonth, Carbon::today());

    
                $years = Chart::selectRaw('YEAR(date) as year')
                    ->distinct()
                    ->orderBy('year', 'desc')
                    ->pluck('year')
                    ->toArray();
    
                $newCache = [
                    'code' => 'success',
                    'message' => 'Chart data cached',
                    'data' => $dataFromDb,
                    'labels' => $labels,
                    'years' => $years,
                ];
    
                Cache::put($cacheKey, $newCache, Carbon::now()->endOfDay());
    
                // Use rebuilt cache for response
                $cached = $newCache;
            }
    
            return response()->json([
                'code' => $ipAlreadyExists ? 'exists' : 'success',
                'message' => $ipAlreadyExists ? 'IP already exists' : 'IP updated successfully',
                'ip' => $ipAddress,
                'cache_data_today' => $cached
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 'error',
                'message' => 'An error occurred while updating list of IPs',
                'error' => $e->getMessage()
            ]);
        }
    }
        









    public function getChartData(Request $request){
        try{
            $request->validate([
                'year' => 'integer|min:2000|max:' . Carbon::now()->year,
                'period' => 'nullable|string|regex:/\(\d{2}-\d{2}-\d{4} to \d{2}-\d{2}-\d{4}\)/',
            ]);
            
            $requestedYear = $request->input('year') ?: Carbon::now()->year;
            $period = $request->input('period');
            $today = Carbon::today();
        
            $requestedStart = null;
            $requestedEnd = null;
        
            if ($period) {
                preg_match('/\((\d{2}-\d{2}-\d{4}) to (\d{2}-\d{2}-\d{4})\)/', $period, $matches);
                if (count($matches) === 3) {
                    $requestedStart = Carbon::createFromFormat('d-m-Y', $matches[1])->startOfDay();
                    $requestedEnd = Carbon::createFromFormat('d-m-Y', $matches[2])->endOfDay();
        
                    if ($requestedEnd->greaterThan($today)) {
                        $requestedEnd = $today->copy()->endOfDay();
                    }
                }
            }
        
            if (!$requestedStart || !$requestedEnd) {
                $requestedStart = Carbon::create($requestedYear, 1, 1)->startOfDay();
                $requestedEnd = Carbon::create($requestedYear, 12, 31)->endOfDay();
        
                if ($requestedEnd->greaterThan($today)) {
                    $requestedEnd = $today->copy()->endOfDay();
                }
            }
        
            $fullMonthStart = $requestedStart->copy()->startOfMonth();
            $fullMonthEnd = $requestedStart->copy()->endOfMonth();
            $monthName = $fullMonthStart->format('F');
        
            $cacheKey = $this->generateCacheKey($requestedYear, $monthName, $fullMonthStart, $fullMonthEnd);
            $cachedResponse = Cache::get($cacheKey);
        
            if (!$cachedResponse) {
                // Get full month data from DB
                // Step 1: Fetch raw data from DB
                $rawData = Chart::whereBetween('date', [$fullMonthStart, $fullMonthEnd])
                ->orderBy('date', 'asc')
                ->get(['date', 'ips'])
                ->groupBy(function ($item) {
                    return Carbon::parse($item->date)->toDateString(); // Group by date
                });
            
                // Step 2: Generate full structure with empty ips when no entry exists
                $data = collect();
                $currentDate = $fullMonthStart->copy();
                
                while ($currentDate->lessThanOrEqualTo($fullMonthEnd)) {
                    $dateStr = $currentDate->toDateString();
                
                    $data->push([
                        'date' => $dateStr,
                        'ips' => $rawData->has($dateStr)
                            ? $rawData[$dateStr]->pluck('ips')->flatten()->unique()->values()->all()
                            : []
                    ]);
                
                    $currentDate->addDay();
                }
            

        
                $startOfYear = Carbon::create($requestedYear, 1, 1)->startOfDay();
                $endOfYear = Carbon::create($requestedYear, 12, 31)->endOfDay();
                $labelEnd = $requestedYear == $today->year ? $today->copy()->endOfMonth() : $endOfYear;
        
                $labels = $this->buildLabelsForMonth($requestedYear, $startOfYear, $labelEnd, $today);
        
                $years = Chart::selectRaw('YEAR(date) as year')
                    ->distinct()
                    ->orderBy('year', 'desc')
                    ->pluck('year');
        
                $cachedResponse = [
                    'code' => 'success',
                    'message' => 'Chart data retrieved',
                    'data' => $data->values(),
                    'labels' => $labels,
                    'years' => $years,
                ];
        
                Cache::put($cacheKey, $cachedResponse, Carbon::now()->endOfDay());
            }
        
            // Filter data to only include the requested partial range
            $filteredData = collect($cachedResponse['data'])->filter(function ($entry) use ($requestedStart, $requestedEnd) {
                return Carbon::parse($entry['date'])->between($requestedStart, $requestedEnd);
            })->map(function ($entry) {
                return [
                    'date' => $entry['date'],
                    'ips' => count($entry['ips']) // Return only the count of IPs
                ];
            })->values();
            
            return response()->json([
                'code' => 'success',
                'message' => 'Chart data retrieved for requested period',
                'data' => $filteredData,
                'labels' => $cachedResponse['labels'],
                'years' => $cachedResponse['years'],
            ]);
        }catch(\Exception $e){
            return response()->json([
                'code' => 'error',
                'message' => 'An error occurred while fetching chart data',
                'error' => $e->getMessage()
            ]);
        }
    }
        




    private function buildLabelsForMonth($year, Carbon $start, Carbon $end, Carbon $today)
    {
        $labels = [];
        $current = $start->copy();
    
        while ($current->lessThanOrEqualTo($end)) {
            $monthStart = $current->copy()->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();
    
            // If this is the current month and the year matches today's year, cap at today
            if ($monthStart->isSameMonth($today) && $year == $today->year) {
                $monthEnd = $today->copy()->endOfDay();
            }
    
            $labels[] = $monthStart->format('F') . ' (' . $monthStart->format('d-m-Y') . ' to ' . $monthEnd->format('d-m-Y') . ')';
            $current->addMonth();
        }
    
        return array_reverse($labels); // Show latest month first
    }

        














    
    // public function getChartData(Request $request){
    //     try{
    //         $request->validate([
    //             'year' => 'integer|min:2000|max:' . Carbon::now()->year,
    //             'period' => 'nullable|string|regex:/\(\d{2}-\d{2}-\d{4} to \d{2}-\d{2}-\d{4}\)/',
    //         ]);
            
    //         $requestedYear = $request->input('year') ?: Carbon::now()->year;
    //         $period = $request->input('period');
    //         $today = Carbon::today();
        
    //         $requestedStart = null;
    //         $requestedEnd = null;
        
    //         if ($period) {
    //             preg_match('/\((\d{2}-\d{2}-\d{4}) to (\d{2}-\d{2}-\d{4})\)/', $period, $matches);
    //             if (count($matches) === 3) {
    //                 $requestedStart = Carbon::createFromFormat('d-m-Y', $matches[1])->startOfDay();
    //                 $requestedEnd = Carbon::createFromFormat('d-m-Y', $matches[2])->endOfDay();
        
    //                 if ($requestedEnd->greaterThan($today)) {
    //                     $requestedEnd = $today->copy()->endOfDay();
    //                 }
    //             }
    //         }
        
    //         if (!$requestedStart || !$requestedEnd) {
    //             $requestedStart = Carbon::create($requestedYear, 1, 1)->startOfDay();
    //             $requestedEnd = Carbon::create($requestedYear, 12, 31)->endOfDay();
        
    //             if ($requestedEnd->greaterThan($today)) {
    //                 $requestedEnd = $today->copy()->endOfDay();
    //             }
    //         }
        
    //         $fullMonthStart = $requestedStart->copy()->startOfMonth();
    //         $fullMonthEnd = $requestedStart->copy()->endOfMonth();
    //         $monthName = $fullMonthStart->format('F');
        
    //         $cacheKey = $this->generateCacheKey($requestedYear, $monthName, $fullMonthStart, $fullMonthEnd);
    //         $cachedResponse = Cache::get($cacheKey);
        
    //         if (!$cachedResponse) {
    //             // Get full month data from DB
    //             $data = Chart::whereBetween('date', [$fullMonthStart, $fullMonthEnd])
    //                 ->orderBy('date', 'asc')
    //                 ->get(['date', 'ips']);
        
    //             $startOfYear = Carbon::create($requestedYear, 1, 1)->startOfDay();
    //             $endOfYear = Carbon::create($requestedYear, 12, 31)->endOfDay();
    //             $labelEnd = $requestedYear == $today->year ? $today->copy()->endOfMonth() : $endOfYear;
        
    //             $labels = $this->buildLabelsForMonth($requestedYear, $startOfYear, $labelEnd, $today);
        
    //             $years = Chart::selectRaw('YEAR(date) as year')
    //                 ->distinct()
    //                 ->orderBy('year', 'desc')
    //                 ->pluck('year');
        
    //             $cachedResponse = [
    //                 'code' => 'success',
    //                 'message' => 'Chart data retrieved',
    //                 'data' => $data->values(),
    //                 'labels' => $labels,
    //                 'years' => $years,
    //             ];
        
    //             Cache::put($cacheKey, $cachedResponse, now()->addWeek());
    //         }
        
    //         // Filter data to only include the requested partial range
    //         $filteredData = collect($cachedResponse['data'])->filter(function ($entry) use ($requestedStart, $requestedEnd) {
    //             return Carbon::parse($entry['date'])->between($requestedStart, $requestedEnd);
    //         })->values();
        
    //         return response()->json([
    //             'code' => 'success',
    //             'message' => 'Chart data retrieved for requested period',
    //             'data' => $filteredData,
    //             'labels' => $cachedResponse['labels'],
    //             'years' => $cachedResponse['years'],
    //         ]);
    //     }catch(\Exception $e){
    //         return response()->json([
    //             'code' => 'error',
    //             'message' => 'An error occurred while fetching chart data',
    //             'error' => $e->getMessage()
    //         ]);
    //     }
    // }
        




    // private function buildLabelsForMonth($year, Carbon $start, Carbon $end, Carbon $today)
    // {
    //     $labels = [];
    //     $current = $start->copy();
    
    //     while ($current->lessThanOrEqualTo($end)) {
    //         $monthStart = $current->copy()->startOfMonth();
    //         $monthEnd = $monthStart->copy()->endOfMonth();
    
    //         // If this is the current month and the year matches today's year, cap at today
    //         if ($monthStart->isSameMonth($today) && $year == $today->year) {
    //             $monthEnd = $today->copy()->endOfDay();
    //         }
    
    //         $labels[] = $monthStart->format('F') . ' (' . $monthStart->format('d-m-Y') . ' to ' . $monthEnd->format('d-m-Y') . ')';
    //         $current->addMonth();
    //     }
    
    //     return array_reverse($labels); // Show latest month first
    // }



}


