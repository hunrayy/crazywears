<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\Pages;
use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\Rule;



class GetPagesController extends Controller
{
    //
    private $validPages = ['shippingPolicy', 'refundPolicy', 'deliveryPolicy'];

    public function index(Request $request)
    {
        try {
            $request->validate([
                'page' => ['required', 'string', Rule::in($this->validPages)],
            ]);

            $page = $request->query('page');

            $cacheKey = "pages.{$page}.content";
            $cachedData = Cache::get($cacheKey);
        
            if ($cachedData) {
                return response()->json([
                    'code' => 'success',
                    'message' => "$page page successfully retrieved from cache",
                    'data' => $cachedData
                ]);
            }

            $feedback = Pages::where("page", $page)->first();
            if ($feedback) {
                $pageData = $feedback->content;

                Cache::put($cacheKey, $pageData, now()->addDays(1));

                return response()->json([
                    'code' => 'success',
                    'message' => "$page page successfully retrieved from database",
                    'data' => $pageData
                ]);
            }

            return response()->json([
                'code' => 'error',
                'message' => 'Page not found in database'
            ]);

        } catch (\Exception $e) {
            // Optional: Log the exception for internal review
            \Log::error('Error retrieving page: ' . $e->getMessage());

            return response()->json([
                'code' => 'error',
                'message' => 'An unexpected error occurred, please try again later '
            ]);
        }
    }

    
}




























// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Cache;
// use App\Models\Pages;
// use Illuminate\Support\Facades\Redis;


// class GetPagesController extends Controller
// {
//     //
//     public function index(Request $request){
//         $page = $request->query('page');

//         if($page == "shippingPolicy"){

//             return $this->getShippingPolicy();

//         }else if($page == 'refundPolicy'){
            
//             return $this->getRefundPolicy();

//         }else if($page == 'deliveryPolicy'){

//             return $this->getDeliveryPolicy();
//         }
//     }
//     public function getShippingPolicy(){
//         $cachedData = cache::get('shippingPolicy');
//         if ($cachedData) {
//             return response()->json([
//                 'code' => 'success',
//                 'message' => 'Shipping policy page successfully retrieved from cache',
//                 'data' => json_decode($cachedData, true)
//             ]);
//         }

//         $feedback = Pages::where("page", 'shippingPolicy')->first();
//         if($feedback){
//             $pageData = $feedback->content;
            

//             Cache::put('shippingPolicy', json_encode($pageData, true));
            
//             return response()->json([
//                 'code' => 'success',
//                 'message' => 'Shipping policy page successfully retrieved from database',
//                 'data' => $pageData
//             ]);
//         }
//         return response()->json([
//             'code' => 'error',
//             'message' => 'Page not found in database'
//         ]);
//     }

//     public function getRefundPolicy(){
//         try{
//             $cachedData = cache::get('refundPolicy');

//             if ($cachedData) {
//                 return response()->json([
//                     'code' => 'success',
//                     'message' => 'Refund policy page successfully retrieved from cache',
//                     'data' => json_decode($cachedData, true)
//                 ]);
//             }
    
//             $feedback = Pages::where("page", 'refundPolicy')->first();
//             if($feedback){
//                 $pageData = $feedback->content;
    
//                 Cache::put('refundPolicy', json_encode($pageData, true));
                
//                 return response()->json([
//                     'code' => 'success',
//                     'message' => 'Refund policy page successfully retrieved from database',
//                     'data' => $pageData
//                 ]);
//             }
//         }catch(Exception $e){
//             return response()->json([
//                 'code' => 'error',
//                 'message' => 'Page not found in database',
//                 "reason" => $e->getMessage()
//             ]);
//         }
//     }


//     public function getDeliveryPolicy(){
//         $cachedData = cache::get('deliveryPolicy');

//         if ($cachedData) {
//             return response()->json([
//                 'code' => 'success',
//                 'message' => 'Delivery policy page successfully retrieved from cache',
//                 'data' => json_decode($cachedData, true)
//             ]);
//         }

//         $feedback = Pages::where("page", 'deliveryPolicy')->first();
//         if($feedback){
//             $pageData = $feedback->content;

//             Cache::put('deliveryPolicy', json_encode($pageData, true));
            
//             return response()->json([
//                 'code' => 'success',
//                 'message' => 'Delivery policy page successfully retrieved from database',
//                 'data' => $pageData
//             ]);
//         }
//         return response()->json([
//             'code' => 'error',
//             'message' => 'Page not found in database'
//         ]);
//     }
// }
