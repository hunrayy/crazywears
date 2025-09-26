<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CurrencyController extends Controller
{
    //
    public function convertCurrency($amountInPounds, $targetCurrency){
        $apiUrl = 'https://api.exchangerate-api.com/v4/latest/GBP';

        try {
            // Send a GET request to fetch exchange rates for GBP
            $response = Http::get($apiUrl);

            if ($response->successful()) {
                // Get the target currency exchange rate from the response
                $targetCurrencyRate = $response['rates'][$targetCurrency];

                
                $convertedAmount = $amountInPounds * $targetCurrencyRate;

                return $convertedAmount;
            } else {
                return response()->json([
                    'code' => "error",
                    'message' => 'Failed to retrieve exchange rates'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'code' => "error",
                'message' => 'Error converting currency: ' . $e->getMessage()
            ]);
        }
    }

    public function fetchcurrencyData(){
        try {
            // Cache key and TTL (30 days)
            $cacheKey = 'currency_data_array';
            $ttl = 60 * 60 * 24 * 30;

            // Return from cache if exists
            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey));
            }

            // Fetch from external API
            $response = Http::get('https://restcountries.com/v3.1/all?fields=name,currencies');

            if ($response->failed()) {
                return response()->json(['code' => 'error', 'message' => 'Failed to fetch currency data'], 500);
            }

            $rawData = $response->json();
            $currencyMap = [];

            // Collect unique currencies
            foreach ($rawData as $country) {
                if (!isset($country['currencies'])) continue;

                foreach ($country['currencies'] as $code => $details) {
                    if (!isset($currencyMap[$code])) {
                        $currencyMap[$code] = [
                            'code' => $code,
                            'symbol' => $details['symbol'] ?? '',
                            'name' => $details['name'] ?? '',
                        ];
                    }
                }
            }

            // Convert to indexed array
            $currencyArray = array_values($currencyMap);

            // Store in cache
            Cache::put($cacheKey, $currencyArray, $ttl);

            return response()->json($currencyArray);

        } catch (\Exception $e) {
            return response()->json([
                'code' => 'error',
                'message' => 'Failed to fetch currency data',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function fetchExchangeRate()
    {
        try {
            $cacheKey = 'exchange_rates';
            $ttl = 60 * 60 * 6; // 6 hours

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey));
            }

            $baseCurrency = env('CURRENCY_CODE', 'NGN'); // fallback if .env is missing it
            $url = "https://api.exchangerate-api.com/v4/latest/{$baseCurrency}";
            $response = Http::get($url);

            if ($response->failed()) {
                return response()->json(['code' => 'error', 'message' => 'Failed to fetch exchange rates'], 500);
            }

            $data = $response->json();
            Cache::put($cacheKey, $data, $ttl);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['code' => 'error', 'message' => 'Error occurred', 'error' => $e->getMessage()], 500);
        }
    }




    public function getAllCountriesAndStates(){
        try{
            $cacheKey = 'countries_and_states';
            $cacheDuration = now()->addDays(30); // You can also use `now()->addMinutes(60)`

            // First check if cache exists
            if (Cache::has($cacheKey)) {
                $cachedData = Cache::get($cacheKey);
                return response()->json([
                    'message' => 'Data retrieved from cache',
                    'code' => 'success',
                    'data' => $cachedData,
                ]);
            }

            // If not cached, fetch from API
            $response = Http::timeout(10)->get('https://countriesnow.space/api/v0.1/countries/states');

            if ($response->successful()) {
                $fetchedData = $response->json();

                // Store in cache
                Cache::put($cacheKey, $fetchedData, $cacheDuration);

                return response()->json([
                    'message' => 'Data fetched from external API',
                    'code' => 'success',
                    'data' => $fetchedData,
                ]);
            }
        }catch(\Exception $e){
            // If the request fails
            return response()->json([
                'message' => 'Failed to fetch countries and states',
                'code' => 'error',
                'error' => $e
            ]);
        }

    }



}
