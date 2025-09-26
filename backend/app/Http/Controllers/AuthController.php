<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception; //for catching errors
use Illuminate\Support\Facades\Mail; //for mail sending
use App\Http\Controllers\MailController;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;


use Illuminate\Support\Facades\Validator; //for validating the request coming in
use Illuminate\Support\Facades\Hash; //for password hahsing
use Illuminate\Support\Facades\Log; //for logging error to the terminal
use App\Models\User;
use App\Models\Admin;
use App\Models\Shipping;
use App\Models\Order;



class AuthController extends Controller
{
    //
    //function to generate a random 6 digit code
    private function generateVerificationCode(){
        return random_int(100000, 999999);
    }

    //function to create a JWT token
    public function createToken($payload, $expiresIn){
        $key = env('JWT_SECRET');
        $payload['exp'] = time() + $expiresIn; // Token expiration time in seconds

        return JWT::encode($payload, $key, 'HS256');
    }

    public function sendEmailVerificationCode(Request $request){
        $request->validate([
            'email' => 'string|required',
            'previousEmail' => 'string|nullable'
        ]);

        $email = $request->email;
        $previousEmail = $request->previousEmail;

        // If email is different from previousEmail, check for duplicates
        if($email !== $previousEmail){
            $checkIfEmailExists = User::where('email', $email)->first();
            if($checkIfEmailExists){
                return response()->json([
                    'code' => 'error',
                    'message' => 'Email already in use'
                ]);
            }
        }

        $verificationCode = $this->generateVerificationCode();

        // Use PHPMailer to send the email
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = env('MAIL_USERNAME');
            $mail->Password = env('MAIL_PASSWORD');
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Email Verification Code';
            $mail->Body = '<h4>Your Email Verification code is ' . $verificationCode . '</h4>';

            $mail->send();

            $hashedCode = $this->createToken(['code' => $verificationCode], 300);
            return response()->json([
                'code' => 'success',
                'message' => 'Email verification code sent successfully',
                'verificationCode' => $hashedCode,
                'testCode' => $verificationCode
            ]);
        } catch (Exception $e) {
            Log::error('Error occurred: ' . $e->getMessage());
            return response()->json([
                'code' => 'error',
                'message' => 'An error occurred while sending the verification code',
                'reason' => $mail->ErrorInfo
            ]);
        }
    }


    //function to verify the code sent
    public function verifyEmailVerificationCode(Request $request){
        //validation rules
        $validator = Validator::make($request->all(), [
            'verificationCode' => 'required|string',
        ]);
        if($validator->fails()){
            return response()->json([
                'code' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ]);
        }
        $email = $request->input('email');
        $verificationCode = $request->input('verificationCode');
        $authHeader = $request->header('Authorization');
        if ($authHeader) {
            // Split the header to extract the token
            list($bearer, $verificationCodeFromCookie) = explode(' ', $authHeader);
    
            // Check if the header starts with 'Bearer'
            if (strcasecmp($bearer, 'Bearer') === 0) {
                // Perform action with the token token extracted
                try{
                    //verify the token (JWT)
                    $decoded = JWT::decode($verificationCodeFromCookie, new Key(env('JWT_SECRET'),'HS256'));
                    $decodedArray = (array)$decoded;
        
                    if($decodedArray['code'] == $verificationCode){
                        //if the verification code matches, create a new token
                        $payload = ['email' => $email];
                        $createAccountToken = $this->createToken($payload, 20 * 60); // 20 minutes expiration timec
        
                        return response()->json([
                            'code' => 'success',
                            'message' => 'Email Successfully verified, proceed to register',
                            'createAccountToken' => $createAccountToken
                        ]);
        
                    }else{
                        return response()->json([
                            'code' => 'error',
                            'message' => 'Invalid verification code'
                        ]);
                    }
                }catch(ExpiredException $e){
                    return response()->json([
                        'code' => 'error',
                        'message' => 'Verification code has expired. kindly request a new one',
                        'reason' => $e->getMessage()
                    ]);
                }catch (\Exception $e) {
                    Log::error('Error occurred: ' . $e->getMessage());

                    return response()->json([
                        'code' => 'error',
                        'message' => 'An error occurred while verifying token',
                        'reason' => $e->getMessage()
                    ]);
                }
            } else {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Authorization type must be Bearer',
                ]);
            }
        } else {
            return response()->json([
                'code' => 'error',
                'message' => 'Authorization header not provided',
            ]);
        }
    }

    public function register(Request $request)
    {
        // Validate request
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        try {

            $authorization = $request->header("Authorization");


            if (!$authorization || $authorization == 'Bearer undefined') {
                return response()->json([
                    'code' => 'invalid-jwt',
                    'message' => 'Authorization header not found'
                ]);
            }
            // Split the bearer token
            $bearerToken = explode(' ', $authorization)[1];
            

            // Verify the token
            $decodedToken = JWT::decode($bearerToken, new Key(env("JWT_SECRET"), 'HS256'));

            // Attach user email to the request
           


            // Check if the user already exists
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Email already in use',
                ]);
            }

            // Hash the password
            $hashedPassword = Hash::make($request->password);

            // Create new user
            $user = User::create([
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'password' => $hashedPassword,
            ]);

            $allUsers = User::all()->toArray();
            Cache::put('allUsers', json_encode($allUsers), 1440); //expiration time of one day

            return response()->json([
                'code' => 'success',
                'message' => 'Account successfully created',
                'data' => [
                    'firstname' => $request->firstname,
                    'email' => $request->email,
                ],
            ]);
        } catch (ExpiredException $e) {
            return response()->json([
                'code' => 'invalid-jwt',
                'message' => 'Token has expired'
            ]);

        } catch (\Exception $error) {
            Log::error('Error occurred: ' . $error->getMessage());
            return response()->json([
                'code' => 'error',
                'message' => 'Account could not be created',
                'reason' => $error->getMessage(),
            ]);
        }
    }
    public function login(Request $request){
        try{
                //validate the request coming in
            $validator = Validator::make($request->all(), [
                'email' => 'required|string',
                'password' => 'required|string'
            ]);
            if($validator->fails()){
                return response()->json([
                    'code' => 'error',
                    'message' => 'Email and password required'
                ]);
            }
            //check if the user exists by email
            $user = User::where('email', $request->input('email'))->first();
            if(!$user){
                return response()->json([
                    'code' => 'error',
                    'message' => 'Invalid email/password, have you registered?'
                ]);
            }

            //the user exists.
            //verify if the password match
            if(!Hash::check($request->input('password'), $user->password)){
                return response()->json([
                    'code' => 'error',
                    'message' => 'Invalid email/password, have you registered?'
                ]);
            }
            //password match...create JWT login token for user
            $payload = [
                'id' => $user->id,
                'email' => $user->email,
                'password' => $user->password
            ];
            $token = $this->createToken($payload, 20 * 86400);
            
            return response()->json([
                'message' => 'Login success',
                'code' => 'success',
                'data' => [
                    'firstname' => $user->firstname,
                    'email' => $user->email,
                    'token' => $token
                ]
            ]);
        }catch(\Exception $e){
            Log::error('Error occurred: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while logging you in.',
                'code' => 'error',
                'reason' => $e->getMessage()
            ]);
        }

        
    }



    public function getNumberOfDaysOfDelivery(Request $request){
        try{
            $table = Shipping::first();
            
            $numberOfDaysForDomesticDelivery = $table->numberOfDaysForDomesticDelivery;
            $numberOfDaysForInternationalDelivery = $table->numberOfDaysForInternationalDelivery;
            $countryOfWarehouseLocation = $table->countryOfWarehouseLocation;
            $domesticShippingFee = $table->domesticShippingFee;
            $internationalShippingFee = $table->internationalShippingFee;

            return response()->json([
                "message" => 'number of days for domestic and international delivery fetched successfully',
                "code" => "success",
                "data" => [
                    'countryOfWarehouseLocation' => $countryOfWarehouseLocation,
                    "numberOfDaysForDomesticDelivery" => $numberOfDaysForDomesticDelivery,
                    "numberOfDaysForInternationalDelivery" => $numberOfDaysForInternationalDelivery,
                    "domesticShippingFee" => $domesticShippingFee,
                    "internationalShippingFee" => $internationalShippingFee
                ]
            ]);
        }catch(\Exception $e){
            return response()->json([
                "message" => 'An error occured while fetching number of days for domestic and international delivery fetched successfully',
                "code" => "error",
                "reason" => $e->getMessage()
            ]);
        }

    }


    // public function getUserOrders(Request $request){
    //     try{
    //         $email = $request->input('user_email');
    //         // return $email;

    //         //get the user details using email
    //         // $userDetails = User::where('email', $email)->first();

    //         // $userId = $userDetails->id;
    //         $userId = $request->user_id;

    //         //use the id obtained to retrieved a list of the user's order

    //         //check if user order exists in cache
    //         $cachedOrders = Cache::get($userId . '_orders');
    //         if($cachedOrders){
    //             return response()->json([
    //                 "message" => "User order successfully retrieved from cache",
    //                 "code" => "success",
    //                 // "data" => $userOrder ? $userOrder :     []
    //                 "data" => json_decode($cachedOrders)
    //             ]);
    //         }

    //         //user order doesn't exist in cache, query the database

    //         $userOrder = Order::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
            
    //         //save fetched orders to cache
    //         Cache::put($userId . '_orders', json_encode($userOrder), 1440); //expiration time of one day

    //         return response()->json([
    //             "message" => "User order successfully retrieved from database",
    //             "code" => "success",
    //             "data" => $userOrder ? $userOrder :     []
    //         ]);
    //     }catch(\Exception $e){
    //         return response()->json([
    //             "message" => "An error occured while retrieving user's order list",
    //             "code" => "error",
    //             "reason" => $e.getMessage()
    //         ]);
    //     }
        
    // }


    public function getUserOrders(Request $request) {
        try {
            $userId = $request->user_id;
            $page = (int) $request->query('page', 1);
            $perPage = (int) $request->query('perPage', 10); // Default perPage = 10

            $cacheKey = $userId . '_orders';

            // Check if user's orders exist in cache
            $cachedOrders = Cache::get($cacheKey);

            if ($cachedOrders) {
                $ordersCollection = collect(json_decode($cachedOrders)); // Convert to Laravel Collection
            } else {
                // Fetch from DB if not cached
                $ordersCollection = Order::where('user_id', $userId)->orderBy('created_at', 'desc')->get();

                // Store in cache for 1 day
                Cache::put($cacheKey, json_encode($ordersCollection), 1440); // 1440 minutes = 1 day
            }

            // Paginate the collection in memory
            $paginated = $ordersCollection->slice(($page - 1) * $perPage, $perPage)->values();

            return response()->json([
                "message" => $cachedOrders ? "User orders successfully retrieved from cache" : "User orders successfully retrieved from database",
                "code" => "success",
                "data" => [
                    'data' => $paginated,
                    'total' => $ordersCollection->count(),
                    'current_page' => $page,
                    'per_page' => $perPage,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "message" => "An error occurred while retrieving user's order list",
                "code" => "error",
                "reason" => $e->getMessage() // fixed typo from `$e.getMessage()` to `$e->getMessage()`
            ]);
        }
    }


    // public function sendFeedback(Request $request){
    //     try{
    //         $request->validate([
    //             'formData.firstname' => 'required|string',
    //             'formData.email' => 'required|email',
    //             'formData.comment' => 'required|string', // Ensure this is present
    //             'formData.phone' => 'required|string',
    //             'formData.otp' => 'required|numeric',
    //         ]);

    //         $codeFromCookies = $request->header('codeFromCookies');
    //         $OTP = (int)$request->input('formData.otp');
    //         $previousEmail = $request->input('formData.previousEmail');

    //         if(!$codeFromCookies){
    //             return response()->json([
    //                 'message' => 'The OTP you provided seems to be invalid or expired',
    //                 'code' => 'invalid-jwt',
    //             ]);
    //         }
    //         //decode codeFromCookies
    //         $decodeToken = JWT::decode($codeFromCookies, new Key(env('JWT_SECRET'), 'HS256'));
    //         $decodedToken = $decodeToken->code;

    //         // Compare the decodedToken with the OTP
    //         if($decodedToken !== $OTP){
    //             return response()->json([
    //                 'message' => 'Invalid OTP',
    //                 'code' => 'invalid-jwt',
    //             ]);
    //         }

    //         //fetch the admin email
    //         $adminDetails = Admin::first();

    //         $adminEmail = $adminDetails->email;
    //         $firstname = $request->input('formData.firstname');

    //         //proceed to mail the admin with the feedback
    //         $subject = "Feedback from user named $firstname";
    //         $body = $request->input('formData.comment');
    //         // Send the email
    //         $mailClass = new MailController();
    //         $mailClass->sendEMail($adminEmail, $subject, $body);

    //         return response()->json([
    //             'message' => "Feedback sent successfully",
    //             "code" => "success"
    //         ]);


    //     }catch(\Exception $e){
    //         return response()->json([
    //             'message' => 'An error occured while sending feedback',
    //             'code' => 'invalid-jwt',
    //             'reason' => $e->getMessage(),
    //         ]);
    //     }
    // }

   
    
}
