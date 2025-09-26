<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Http\Controllers\MailController;
use App\Http\Controllers\CurrencyController;

use Illuminate\Support\Facades\Mail;
use App\Mail\OrderReceiptMail;
use App\Mail\OrderStatusMail;


use App\Models\Order;
use App\Models\User; 
use App\Models\UnprocessedPayments; 
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;


/**
 * pass the expected date of delivery, shipping fee and transaction id from flutter wave to the mail and save to the database also
 */

class OrderController extends Controller
{
    //

    public function saveProductToDbAfterPayment($detailsToken){
        
        $request = request();
        try{            
            $details = UnprocessedPayments::where('id', $detailsToken)->first();

            if (!$details) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'No payment details found for this token.'
                ]);
            }
          
            
            // Extract details from the token
            $firstname = $details->firstname;
            $lastname = $details->lastname;
            $email = $details->email;
            $address = $details->address;
            $city = $details->city;
            $postalCode = $details->postalCode ?? '';
            $phoneNumber = $details->phoneNumber;
            $country = $details->country;
            $state = $details->state;
            $totalPrice = str_replace(',', '', $details->totalPrice);
            $subtotal = str_replace(',', '', $details->subtotal);
            $shippingFee = str_replace(',', '', $details->shippingFee);
            $currency = $details->currency;
            $expectedDateOfDelivery = $details->expectedDateOfDelivery;
            $transactionId = $details->transactionId;

            // $products = $request->input('cartProducts'); // Assuming products are passed from the frontend
            $products = json_decode($details->cartProducts);

            // Fetch user_id from the email passed in the token
            $user = User::where('email', $email)->firstOrFail(); 
            $user_id = $user->id;

            // Create order details
           // Generate unique tracking ID
            do {
                $tracking_id = random_int(1000000000, 9999999999);
            } while (Order::where('tracking_id', $tracking_id)->exists());

            $orderDetails = [
                'tracking_id' => $tracking_id,
                'transaction_id' => $transactionId,
                'user_id' => $user_id,
                'firstname' => $firstname,
                'lastname' => $lastname,
                'email' => $email,
                'country' => $country,
                'state' => $state,
                'address' => $address,
                'city' => $city,
                'subtotal' => $subtotal,
                'shippingFee' => $shippingFee,
                'postalCode' => $postalCode,
                'phoneNumber' => $phoneNumber,
                'totalPrice' => $totalPrice,
                'currency' => $currency,
                'products' => json_encode($products), // Save products as JSON
                'expectedDateOfDelivery' => $expectedDateOfDelivery,
                'status' => 'Pending'
            ];

            // Save order to the database
            $order = Order::create($orderDetails);

            // Check if 'pendingOrders' exists in the cache
            if (Cache::has('pendingOrders')) {
                // If 'pendingOrders' are cached, get the existing cached data
                $allPendingOrders = json_decode(Cache::get('pendingOrders'), true);
            } else {
                // If 'pendingOrders' is not cached, fetch from the database
                $allPendingOrders = Order::where('status', 'pending')
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->toArray();
                
                // Cache the fetched orders for future use
                Cache::put('pendingOrders', json_encode($allPendingOrders, true));
            }

            // Now add the new order to the list of pending orders in the cache
            $newOrder = [
                'tracking_id' => $tracking_id,
                'transaction_id' => $transactionId,
                'user_id' => $user_id,
                'firstname' => $firstname,
                'lastname' => $lastname,
                'email' => $email,
                'country' => $country,
                'state' => $state,
                'address' => $address,
                'city' => $city,
                'subtotal' => $subtotal,
                'shippingFee' => $shippingFee,
                'postalCode' => $postalCode,
                'phoneNumber' => $phoneNumber,
                'totalPrice' => $totalPrice,
                'currency' => $currency,
                'products' => json_encode($products),
                'expectedDateOfDelivery' => $expectedDateOfDelivery,
                'status' => 'Pending'
            ];

            // Add the new order to the pending orders array
            $allPendingOrders[] = $newOrder;

            // Save the updated list of pending orders back to the cache
            Cache::put('pendingOrders', json_encode($allPendingOrders, true), now()->addHours(12));

            // Send the email
            Mail::to($email)->queue(new OrderReceiptMail($orderDetails, $products));


            // $updatedOrders = Order::where('user_id', $request->user_id)->orderBy('created_at', 'desc')->get()->toArray();
            
            // Cache::put($request->user_id . '_orders', json_encode($updatedOrders, true));
            //fetch all fresh orders for the user that just made payment and update the cache
            $userOrdersCacheKey = $order->user_id . '_orders';
            $cachedUserOrders = Cache::get($userOrdersCacheKey);

            if ($cachedUserOrders) {
                $userOrders = json_decode($cachedUserOrders, true);

                // Remove the previous version of the order (if it exists)
                $userOrders = array_filter($userOrders, function($item) use ($tracking_id) {
                    return $item['tracking_id'] !== $tracking_id;
                });

                // Add the updated order
                $userOrders[] = $order->toArray();

                // Optional: sort by created_at descending
                usort($userOrders, function($a, $b) {
                    return strtotime($b['created_at']) <=> strtotime($a['created_at']);
                });

                Cache::put($userOrdersCacheKey, json_encode($userOrders));
            } else {
                // Cache doesn't exist yet, create it with just this order
                $userOrder = Order::where('user_id', $order->user_id)->orderBy('created_at', 'desc')->get();
                Cache::put($userOrdersCacheKey, json_encode($userOrder));
        
            }
            UnprocessedPayments::where('id', $detailsToken)->delete();


            return response()->json([
                'message' => 'Product(s) ordered successfully saved to DB',
                'code' => 'success'
            ]);


        }catch (\Exception $error) {
            return response()->json([
                'message' => 'Products ordered could not be saved to DB',
                'code' => 'error',
                'reason' => $error->getMessage()
            ]);
        }

    }


    // public function getOrders(Request $request){
    //     try{
    //         $query = $request->query('status');
    //         if($query == "pending"){
    //             //check if pending orders are saved in cache
    //             $cachedOrders = Cache::get('pendingOrders');
    //             if($cachedOrders){
    //                 return response()->json([
    //                     "message" => "all pending orders successfully retrieved from cache",
    //                     "code" => "success",
    //                     "data" => json_decode($cachedOrders, true)
    //                 ]);
    //             }else{
    //                 //fetch all pending orders from database
    //                 $allPendingOrders = Order::where('status', 'pending')->orderBy('created_at', 'desc')->get()->toArray();

    //                 //save fetched orders to cache
    //                 Cache::put('pendingOrders', json_encode($allPendingOrders, true));

    //                 return response()->json([
    //                     "message" => "all pending orders successfully retrieved from database",
    //                     "code" => "success",
    //                     "data" => $allPendingOrders
    //                 ]);
    //             }


    //         }else if($query == "outForDelivery"){
    //             //check if out-for-delivery orders are saved in cache
    //             $cachedOrders = Cache::get('outForDeliveryOrders');

    //             if($cachedOrders){
    //                 return response()->json([
    //                     "message" => "all out-for-delivery orders successfully retrieved from cache",
    //                     "code" => "success",
    //                     "data" => json_decode($cachedOrders, true)
    //                 ]);
    //             }else{
    //                 //fetch all out-for-delivery orders from database
    //                 $allOutForDeliveryOrders = Order::where('status', 'outForDelivery')->orderBy('updated_at', 'desc')->get()->toArray();

    //                 //save fetched orders to cache
    //                 Cache::put('outForDeliveryOrders', json_encode($allOutForDeliveryOrders, true));
                    
    //                 return response()->json([
    //                     "message" => "all out-for-delivery orders successfully retrieved from database",
    //                     "code" => "success",
    //                     "data" => $allOutForDeliveryOrders
    //                 ]);
    //             }
    //         }else if($query == "delivered"){
    //             //check if delivered orders are saved in cache
    //             $cachedOrders = Cache::get('deliveredOrders');

    //             if($cachedOrders){
    //                 return response()->json([
    //                     "message" => "all delivered orders successfully retrieved from cache",
    //                     "code" => "success",
    //                     "data" => json_decode($cachedOrders, true)
    //                 ]);
    //             }else{
    //                 //fetch all delivered orders from database
    //                 $allDeliveredOrders = Order::where('status', 'delivered')->orderBy('created_at', 'desc')->get()->toArray();

    //                 //save fetched orders to cache
    //                 Cache::put('deliveredOrders', json_encode($allDeliveredOrders, true));
                    
                    
    //                 return response()->json([
    //                     "message" => "all delivered orders successfully retrieved from database",
    //                     "code" => "success",
    //                     "data" => $allDeliveredOrders
    //                 ]);
    //             }
    //         }
    //     }catch(Exception $e){
    //         return response()->json([
    //             "message" => "an error occurred while fetching pending orders",
    //             "code" => "error",
    //             "reason" => $e->getMessage()
    //         ]);
    //     }
    // }


    public function getOrders(Request $request)
    {
        try {
            $status = $request->query('status'); // pending, outForDelivery, delivered
            $page = (int) $request->query('page', 1);
            $perPage = (int) $request->query('perPage', 10);

            $validStatuses = ['pending', 'outForDelivery', 'delivered'];
            if (!in_array($status, $validStatuses)) {
                return response()->json([
                    "message" => "Invalid order status specified.",
                    "code" => "error",
                ]);
            }

            $cacheKey = "{$status}Orders";
            $cached = Cache::get($cacheKey);

            if ($cached) {
                $ordersCollection = collect(json_decode($cached)); // decode + wrap in Collection
            } else {
                $ordersQuery = Order::where('status', $status)
                    ->orderBy(in_array($status, ['pending', 'delivered']) ? 'created_at' : 'updated_at', 'asc')
                    ->get();

                $ordersCollection = $ordersQuery;
                Cache::put($cacheKey, json_encode($ordersCollection), 1440); // 1 day
            }

            $paginated = $ordersCollection->slice(($page - 1) * $perPage, $perPage)->values();

            return response()->json([
                "message" => $cached
                    ? "All {$status} orders retrieved from cache"
                    : "All {$status} orders retrieved from database",
                "code" => "success",
                "data" => [
                    'data' => $paginated,
                    'total' => $ordersCollection->count(),
                    'current_page' => $page,
                    'per_page' => $perPage,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "message" => "An error occurred while fetching orders",
                "code" => "error",
                "reason" => $e->getMessage()
            ]);
        }
    }


    // public function ChangeOrderStatusToOutForDelivery(Request $request){
    //     try{
    //         $request->validate([
    //             'trackingId' => 'string|required'
    //         ]);
    //         //fetch the order in the database using the trackingId
    //         $order = Order::where('tracking_id', $request->trackingId)->first();
    //         if(!$order){
    //             return response()->json([
    //                 "message" => "Order with tracking number does not exist",
    //                 "code" => "error"
    //             ]);
    //         }

    //         $firstname = $order->firstname;
    //         $lastname = $order->lastname;
    //         $email = $order->email;
    //         $address = $order->address;
    //         $city = $order->city;
    //         $postalCode = $order->postalCode;
    //         $phoneNumber = $order->phoneNumber;
    //         $country = $order->country;
    //         $state = $order->state;
    //         $totalPrice = $order->totalPrice;
    //         $trackingId = $order->tracking_id;
    //         $orderDate = $order->created_at->format('F j, Y');
    //         $outForDeliveryDate = $order->updated_at->format('F j, Y');
    //         $currency = $order->currency;
    //         $expectedDateOfDelivery = $order->expectedDateOfDelivery;
    //         $transactionId = $order->transactionId;
    //         $products = json_decode($order->products, true);

    //         //update the status to out-for-delivery
    //         $order->status = 'outForDelivery';
    //         $order->save();

            

    //         //fetch all fresh pending orders from database
    //         $newAllPendingOrders = Order::where('status', 'pending')->orderBy('updated_at', 'desc')->get()->toArray();

    //         //save fetched orders to cache
    //         Cache::put('pendingOrders', json_encode($newAllPendingOrders, true));


    //         //fetch all fresh out-for-delivery orders from database
    //         $newAllOutForDeliveryOrders = Order::where('status', 'outForDelivery')->orderBy('updated_at', 'desc')->get()->toArray();

    //         //save fetched orders to cache
    //         Cache::put('outForDeliveryOrders', json_encode($newAllOutForDeliveryOrders, true));

    //         //fetch all fresh delivered orders from database
    //         $newAllOutForDeliveredOrders = Order::where('status', 'delivered')->orderBy('updated_at', 'desc')->get()->toArray();

    //         //save fetched orders to cache
    //         Cache::put('deliveredOrders', json_encode($newAllOutForDeliveredOrders, true));
            
    //         $userOrder = Order::where('user_id', $order->user_id)->orderBy('created_at', 'desc')->get();
            
    //         //save fetched orders to cache
    //         Cache::put($order->user_id . '_orders', json_encode($userOrder));


    //         //send a notification via mail to the user
    //         $subject = 'Order Status Update'; //subject of mail

    //         $orderSummary = implode('', array_map(function($item, $index) use ($currency) {
    //             // $currencyClass = new CurrencyController();
    //             // $convertedCurrency = $currencyClass->convertCurrency($item['productPriceInNaira'], $currency);

    //             // $formattedPrice = $currency . ' ' . number_format((float)$convertedCurrency, 2, '.', ',');

    //             return "
    //             <div style='display: flex; border: 1px solid #ddd, border-radius: 10px; padding: 10px; margin-bottom: 20px; background-color: #fafafa; maxWidth: 320px;'>
    //                 <img src='{$item['productImage']}' alt='" . htmlspecialchars($item['productName']) . "' style='width: 100%; height: auto; max-width: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px;'>
    //                 <div style='flex-grow: 1;'>
    //                     <h4 style='margin: 0; color: #333; font-size: 18px;'>" . htmlspecialchars($item['productName']) . "</h4>
    //                     <h5 style='margin: 5px 0; color: #777; font-size: 14px;'>Length - " . htmlspecialchars($item['lengthPicked']) . "</h5>
    //                     <h5 style='margin: 5px 0; color: #777; font-size: 14px;'>Quantity * " . htmlspecialchars($item['quantity']) . "</h5>
    //                     <h5 style='margin: 5px 0; color: #777; font-size: 14px;'><b>Price:</b> {$item['updatedPrice']}</5>
    //                 </div>
    //             </div>
    //                 ";
    //         }, $products, array_keys($products)));

    //         $postalCodeSection = $postalCode ? "<b>Postal code:</b> {$postalCode}<br/>" : '';

    //         $body = "
    //             <div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
    //                 <h2 style='color: #4CAF50;'>Order Status Update</h2>
    //                 <p style='font-size: 16px;'>
    //                     <b>Hello {$firstname},</b>
    //                 </p>
    //                 <p>
    //                     We are excited to inform you that your order with Tracking ID: <strong>{$trackingId}</strong> is now <strong>'Out for Delivery'</strong>! Our delivery team is working hard to ensure your order reaches you promptly.
    //                 </p>

    //                 <h4>Order Summary:</h4>
    //                 <ul>
    //                     <li><strong>Tracking ID:</strong> {$trackingId}</li>
    //                     <li><strong>Order Date:</strong> {$orderDate}</li>
    //                     <li><strong>Out For Delivery Date:</strong> {$outForDeliveryDate}</li>
    //                 </ul>

    //                 <h4 style='color: #333;'>Ordered Product(s):</h4>
    //                 <div style='display: flex; flex-wrap: wrap; gap: 10px;'>
    //                     {$orderSummary}
    //                 </div>
                   
    //                 <p>
    //                     If you have any question or concern, feel free to contact our support team.
    //                 </p>
    //                 <p style='margin-top: 20px;'>
    //                     Thank you for choosing us!, and we hope you enjoy your purchase!.
    //                 </p>
    //             </div>
    //         ";

    //         // Send the email
    //         $mailClass = new MailController();
    //         $mailClass->sendEMail($email, $subject, $body);

    //         return response()->json([
    //             'message' => "order status successfully updated to out for delivery",
    //             "code" => "success"
    //         ]);
    //     }catch(\Exception $e){
    //         return response()->json([
    //             'message' => "An error occured while updating order status to out for delivery",
    //             "code" => "error",
    //             "reason" => $e->getMessage()
    //         ]);
    //     }

    // }




     public function ChangeOrderStatusToOutForDelivery(Request $request){
        try{
            $request->validate([
                'trackingId' => 'string|required'
            ]);
            //fetch the order in the database using the trackingId
            $order = Order::where('tracking_id', $request->trackingId)->first();
            if(!$order){
                return response()->json([
                    "message" => "Order with tracking number does not exist",
                    "code" => "error"
                ]);
            }

            $firstname = $order->firstname;
            $lastname = $order->lastname;
            $email = $order->email;
            $address = $order->address;
            $city = $order->city;
            $postalCode = $order->postalCode;
            $phoneNumber = $order->phoneNumber;
            $country = $order->country;
            $state = $order->state;
            $totalPrice = $order->totalPrice;
            $trackingId = $order->tracking_id;
            $orderDate = $order->created_at->format('F j, Y');
            $outForDeliveryDate = $order->updated_at->format('F j, Y');
            $currency = $order->currency;
            $expectedDateOfDelivery = $order->expectedDateOfDelivery;
            $transactionId = $order->transactionId;
            $products = json_decode($order->products, true);

            //update the status to out-for-delivery
            $order->status = 'outForDelivery';
            $order->save();

            

            //update the pending orders in cache to remove the current order
            $cachedPendingOrders = Cache::get('pendingOrders');

            if ($cachedPendingOrders) {
                $pendingOrders = json_decode($cachedPendingOrders, true);

                // Remove the order from pendingOrders cache if it exists
                $pendingOrders = array_filter($pendingOrders, function($item) use ($tracking_id) {
                    return $item['tracking_id'] !== $tracking_id;
                });

                Cache::put('pendingOrders', json_encode(array_values($pendingOrders)));
            }


            //update the out-for-delivery orders in cache to contain the current order

            $cachedOutForDelivery = Cache::get('outForDeliveryOrders');

            if ($cachedOutForDelivery) {
                $outForDeliveryOrders = json_decode($cachedOutForDelivery, true);

                // Add the updated order to the out-for-delivery cache
                $orderArray = $order->toArray();
                $outForDeliveryOrders[] = $orderArray;

                // Optional: sort by updated_at desc if you want it ordered
                usort($outForDeliveryOrders, function($a, $b) {
                    return strtotime($b['updated_at']) <=> strtotime($a['updated_at']);
                });

                Cache::put('outForDeliveryOrders', json_encode($outForDeliveryOrders));
            }

            
            $userOrdersCacheKey = $order->user_id . '_orders';
            $cachedUserOrders = Cache::get($userOrdersCacheKey);

            if ($cachedUserOrders) {
                $userOrders = json_decode($cachedUserOrders, true);

                // Remove the previous version of the order (if it exists)
                $userOrders = array_filter($userOrders, function($item) use ($tracking_id) {
                    return $item['tracking_id'] !== $tracking_id;
                });


                // Add the updated order
                $userOrders[] = $order->toArray();

                // Optional: sort by created_at descending
                usort($userOrders, function($a, $b) {
                    return strtotime($b['created_at']) <=> strtotime($a['created_at']);
                });

                Cache::put($userOrdersCacheKey, json_encode($userOrders));
            } else {
                // Cache doesn't exist yet, create it with just this order
                $userOrder = Order::where('user_id', $order->user_id)->orderBy('created_at', 'desc')->get();
                Cache::put($userOrdersCacheKey, json_encode($userOrder));
        
            }
                

            //send a notification via mail to the user
            Mail::queue(new OrderStatusMail($order, $products, $currency, 'outForDelivery'));


            return response()->json([
                'message' => "order status successfully updated to out for delivery",
                "code" => "success"
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message' => "An error occured while updating order status to out for delivery",
                "code" => "error",
                "reason" => $e->getMessage()
            ]);
        }

    }


    public function ChangeOrderStatusToDelivered(Request $request){
        try{
            DB::transaction(function () use($request){
                $request->validate([
                    'trackingId' => 'string|required'
                ]);
                //fetch the order in the database using the trackingId
                $order = Order::where('tracking_id', $request->trackingId)->first();
                if(!$order){
                    return response()->json([
                        "message" => "Order with tracking number does not exist",
                        "code" => "error"
                    ]);
                }
    
                $firstname = $order->firstname;
                $lastname = $order->lastname;
                $email = $order->email;
                $address = $order->address;
                $city = $order->city;
                $postalCode = $order->postalCode;
                $phoneNumber = $order->phoneNumber;
                $country = $order->country;
                $state = $order->state;
                $totalPrice = $order->totalPrice;
                $trackingId = $order->tracking_id;
                $orderDate = $order->created_at->format('F j, Y');
                $deliveredDate = $order->updated_at->format('F j, Y');
                $currency = $order->currency;
                $expectedDateOfDelivery = $order->expectedDateOfDelivery;
                $transactionId = $order->transactionId;
                $products = json_decode($order->products, true);
    
                //update the status to out-for-delivery
                $order->status = 'delivered';
                $order->save();
    
                // //fetch all fresh delivered orders from database
                // $newAllDeliveredOrders = Order::where('status', 'delivered')->orderBy('updated_at', 'desc')->get()->toArray();
    
                // //save fetched orders to cache
                // Cache::put('deliveredOrders', json_encode($newAllDeliveredOrders, true));
    
                // //fetch all fresh out-for-delivery orders from database
                // $newAllOutForDeliveryOrders = Order::where('status', 'outForDelivery')->orderBy('updated_at', 'desc')->get()->toArray();
    
                // //save fetched orders to cache
                // Cache::put('outForDeliveryOrders', json_encode($newAllOutForDeliveryOrders, true));


                // 🟡 Handle outForDeliveryOrders cache
                $outForDeliveryOrders = json_decode(Cache::get('outForDeliveryOrders', '[]'), true);
                if (empty($outForDeliveryOrders)) {
                    // Cache missing or expired – fetch from DB
                    $outForDeliveryOrders = Order::where('status', 'outForDelivery')->orderBy('updated_at', 'desc')->get()->toArray();
                    Cache::put('outForDeliveryOrders', json_encode($outForDeliveryOrders));
                } else {
                    // Remove delivered order from out-for-delivery list
                    $outForDeliveryOrders = array_filter($outForDeliveryOrders, function ($item) use ($order) {
                        return $item['id'] !== $order->id;
                    });
                    Cache::put('outForDeliveryOrders', json_encode(array_values($outForDeliveryOrders)));
                }

                // 🟢 Handle deliveredOrders cache
                $deliveredOrders = json_decode(Cache::get('deliveredOrders', '[]'), true);
                if (empty($deliveredOrders)) {
                    // Cache missing or expired – fetch from DB
                    $deliveredOrders = Order::where('status', 'delivered')->orderBy('updated_at', 'desc')->get()->toArray();
                } else {
                    // Add the newly delivered order to the top
                    array_unshift($deliveredOrders, $order->toArray());
                }
                // Save updated deliveredOrders cache
                Cache::put('deliveredOrders', json_encode($deliveredOrders));




                // $userOrder = Order::where('user_id', $order->user_id)->orderBy('created_at', 'desc')->get();
            
                // //save fetched orders to cache
                // Cache::put($order->user_id . '_orders', json_encode($userOrder));


                $userOrdersCacheKey = $order->user_id . '_orders';
                $cachedUserOrders = Cache::get($userOrdersCacheKey);

                if ($cachedUserOrders) {
                    $userOrders = json_decode($cachedUserOrders, true);

                    // Remove the previous version of the order (if it exists)
                    $userOrders = array_filter($userOrders, function($item) use ($tracking_id) {
                        return $item['tracking_id'] !== $tracking_id;
                    });

                    // Add the updated order
                    $userOrders[] = $order->toArray();

                    // Optional: sort by created_at descending
                    usort($userOrders, function($a, $b) {
                        return strtotime($b['created_at']) <=> strtotime($a['created_at']);
                    });

                    Cache::put($userOrdersCacheKey, json_encode($userOrders));
                } else {
                    // Cache doesn't exist yet, create it with just this order
                    $userOrder = Order::where('user_id', $order->user_id)->orderBy('created_at', 'desc')->get();
                    Cache::put($userOrdersCacheKey, json_encode($userOrder));
            
                }
                
    
                //send a notification via mail to the user
                Mail::queue(new OrderStatusMail($order, $products, $currency, 'delivered')); 
            });
            return response()->json([
                'message' => "order status successfully updated to delivered",
                "code" => "success"
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message' => "An error occured while updating order status to out for delivery",
                "code" => "error",
                "reason" => $e->getMessage()
            ]);
        }
    }

    public function trackOrder(Request $request){
        try{
            $request->validate([
                'trackingId' => 'required'
            ]);
            $trackingId = $request->query('trackingId');
            $trackOrder = Order::where('tracking_id', $trackingId)->first();
            if(!$trackOrder){
                return response()->json([
                    'code' => 'error',
                    'message' => "Order with tracking id: $trackingId does not exist"
                ]);
            }
            return response()->json([
                'code' => 'success',
                'message' => "Order with tracking id: $trackingId fetched successfully",
                'data' => $trackOrder
            ]); 
        }catch(\Exception $e){
            return response()->json([
                'code' => 'error',
                'message' => "An error occured while tracking order, $e->getMessage()"
            ]);
        }

    }
}
