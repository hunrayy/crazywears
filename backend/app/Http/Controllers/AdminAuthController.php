<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

use PHPMailer\PHPMailer\Exception; //for catching errors
use Illuminate\Support\Facades\Validator; //for validating the request coming in
use Illuminate\Support\Facades\Hash; //for password hahsing
use Illuminate\Support\Facades\Log; //for logging error to the terminal
use App\Http\Controllers\AuthController; 
use Illuminate\Support\Facades\Cache;



use App\Models\Admin;
use App\Models\User;
use App\Models\Shipping;


class AdminAuthController extends Controller
{
    //
    public function adminLogin(Request $request){
        try{
            // Validate request
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json(['message' => 'All fields required', 'code' => 'error']);
            }
            $email = $request->email;
            $password = $request->password;

            // Check if the admin exists
            $admin = User::where('email', $email)->first();
            // Verify email and password
            if (!$admin || !Hash::check($password, $admin->password) || $admin->admin->user_id !== $admin->id) {
                return response()->json(['message' => 'Invalid email/password', 'code' => 'error']);
            }
    
            $shipping = Shipping::first();
            // Prepare the payload for JWT
            $payload = [
                'userId' => $admin->id,
                'firstname' => $admin->firstname,
                'lastname' => $admin->lastname,
                'email' => $admin->email,
                'user'=> 'admin',
                'is_an_admin' => 1,
                ...($admin->admin->is_super_admin === 1 ? ['is_super_admin' => 1] : [])
            ];
            
            $authControllerClass = new AuthController();
            // Create a token (20 days expiration)
            $loginToken = $authControllerClass->createToken($payload, 60 * 60 * 24 * 20); // 20 days in seconds

            // Prepare response data
            return response()->json([
                'message' => 'Login success',
                'code' => 'success',
                'data' => [
                    'firstname' => $admin->firstname,
                    'lastname' => $admin->lastname,
                    'email' => $admin->email,
                    'user' => 'admin',
                    'is_an_admin' => 1,
                    ...($admin->admin->is_super_admin === 1 ? ['is_super_admin' => 1] : []),
                    'token' => $loginToken,
                    // 'countryOfWarehouseLocation' => $shipping->countryOfWarehouseLocation,
                    // 'domesticShippingFee' => $shipping->domesticShippingFee,
                    // 'internationalShippingFee' => $shipping->internationalShippingFee,
                    // 'numberOfDaysForDomesticDelivery' => $shipping->numberOfDaysForDomesticDelivery,
                    // 'numberOfDaysForInternationalDelivery' => $shipping->numberOfDaysForInternationalDelivery
                ],
            ]);


        }catch(\Exception $e){
            // Log::error("An error occured: " . $e->getMessage());
            return response()->json(['code' => 'error', 'message' => 'An error occurred while logging in', 'reason' => $e->getMessage()]);
        }
    }

    public function turnUserToAdmin(Request $request)
    {
       try{
            $validated = $request->validate([
                'userId' => 'required|string|exists:users,id|unique:admin,user_id'
            ]);
        
            $userId = $validated['userId'];
            
            $user = User::find($userId);
        
            if (!$user) {
                return response()->json([
                    'message' => 'User not found.',
                    'code' => 'error'
                ]);
            }
        
            $admin = Admin::create([
                'user_id' => $userId,
                'role_id' => [] // Assuming this is a JSON column
            ]);

            // ❗️Invalidate admin cache
            Cache::forget("admin_user_{$userId}");

            /**
         * CACHE MANAGEMENT
            */

            // 1. Remove user from allUsers cache (if it exists)
            if (Cache::has('allUsers')) {
                $users = Cache::get('allUsers');
                $filtered = collect($users)->reject(fn($u) => $u['id'] === $userId)->values();
                Cache::put('allUsers', $filtered, now()->addHours(1)); // adjust expiration as needed
            }

            // 2. Add the new admin to allAdmins cache
            if (Cache::has('allAdmins')) {
                $admins = Cache::get('allAdmins');
                $newAdmin = User::where('id', $userId)->with('admin.roles')->first();
                $admins[] = $newAdmin;
                Cache::put('allAdmins', $admins, now()->addHours(1));
            } else {
                $allAdmins = User::whereHas('admin')->with(['admin.roles'])->get();
                Cache::put('allAdmins', $allAdmins->toArray(), now()->addHour());
            }
    
            return response()->json([
                'message' => 'User has successfully been made an admin.',
                'admin' => $admin,
                'code' => 'success'
            ]);
        }catch (\Exception $e) {
            return response()->json([
                'message' => "An unexpected error occured: {$e->getMessage()}",
                'code' => 'error'
            ]);
        }
    }
    public function turnAdminToUser(Request $request)
    {
        try {
            $validated = $request->validate([
                'adminId' => 'required|string|exists:admin,user_id'
            ]);
            $adminId = $validated['adminId'];

            // Check if the admin exists
            $admin = Admin::where('user_id', $adminId)->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Admin not found.',
                    'code' => 'error'
                ]);
            }


            // Delete admin record
            $admin->delete();

            Cache::forget("admin_user_{$adminId}");

            /**
             * CACHE MANAGEMENT
             */

            // 1. Remove admin from allAdmins cache (if it exists)
            if (Cache::has('allAdmins')) {
                $admins = Cache::get('allAdmins');
                $filtered = collect($admins)->reject(fn($a) => $a['id'] === $adminId)->values();
                Cache::put('allAdmins', $filtered, now()->addHours(1)); // or use whatever duration you prefer
            }

            // 2. Add user back to allUsers cache
            if (Cache::has('allUsers')) {
                $users = Cache::get('allUsers');
                $user = User::find($adminId);
                $users[] = $user;
                Cache::put('allUsers', $users, now()->addHours(1));
            } else {
                $allUsers = User::doesntHave('admin')->get(); // only users, no admins
                Cache::put('allUsers', $allUsers->toArray(), now()->addHour());
            }

            return response()->json([
                'message' => 'Admin has been successfully reverted to a regular user.',
                'code' => 'success'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "An unexpected error occurred: {$e->getMessage()}",
                'code' => 'error'
            ]);
        }
    }

    


    public function isAdminTokenActive(Request $request){
        return response()->json([
            'code' => 'success',
            'message' => 'User is authorized... grant access',
        ]);
    }





























    


    public function assignRole(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'adminId' => 'required|string|exists:admin,user_id',
                'roleId' => 'required|string|exists:roles,id'
            ]);

            $admin = Admin::where('user_id', $validated['adminId'])->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Admin not found.',
                    'code' => 'error'
                ]);
            }

            // Get current roles (assumes role_id is cast to array in the model)
            $currentRoles = $admin->role_id ?? [];

            // Check if role already exists
            if (in_array($validated['roleId'], $currentRoles)) {
                return response()->json([
                    'message' => 'Admin already has this role.',
                    'code' => 'info'
                ]);
            }

            // Add new role
            $currentRoles[] = $validated['roleId'];
            $admin->role_id = array_values(array_unique($currentRoles)); // Ensure no duplicates
            $admin->save();

            // ❗ Invalidate individual admin cache for permission-sensitive routes
            Cache::forget("admin_user_{$admin->user_id}");

            // Update only the affected admin in the cache
            $cachedAdmins = Cache::get('allAdmins', []);

            foreach ($cachedAdmins as &$cachedAdmin) {
                if ($cachedAdmin['id'] === $admin->user_id) {
                    $adminWithRoles = Admin::where('user_id', $admin->user_id)->with('roles')->first();
                    $cachedAdmin['admin']['role_id'] = $admin->role_id;
                    $cachedAdmin['admin']['role_names'] = $adminWithRoles->roles->pluck('name')->toArray();
                    break;
                }
            }

            Cache::put('allAdmins', $cachedAdmins, now()->addHour());
            
            return response()->json([
                'message' => 'Role assigned successfully.',
                'code' => 'success'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'code' => 'error'
            ]);
        }
    }
    // After saving the updated role_id
    // if (Cache::has('allAdmins')) {
    //     $admins = collect(Cache::get('allAdmins'));

    //     // Log the cache content to confirm structure
    //     \Log::info('Cached Admins:', $admins->toArray());

    //     // Update this specific admin's role_id in the cached list
    //     $updatedAdmins = $admins->map(function ($a) use ($admin) {
    //         // Ensure user_id exists and matches
    //         if (isset($a['user_id']) && $a['user_id'] === $admin->user_id) {
    //             $a['role_id'] = $admin->role_id; // update roles
    //         }
    //         return $a;
    //     });

    //     Cache::put('allAdmins', $updatedAdmins->toArray(), now()->addHours(1));
    // }



    public function shippingSettings(Request $request){
        try{
            $request->validate([
                'formData.countryOfWarehouseLocation' => 'required|string', // Ensure this is present
                'formData.domesticShippingFee' => 'required|numeric',
                'formData.internationalShippingFee' => 'required|numeric',
                'formData.numberOfDaysForDomesticDelivery' => 'required|numeric',
                'formData.numberOfDaysForInternationalDelivery' => 'required|numeric',
            ]);

            //update the shipping table
            Shipping::first()->update([
                'countryOfWarehouseLocation' => $request->input('formData.countryOfWarehouseLocation'),
                'domesticShippingFee' => $request->input('formData.domesticShippingFee'),
                'internationalShippingFee' => $request->input('formData.internationalShippingFee'),
                'numberOfDaysForDomesticDelivery' => $request->input('formData.numberOfDaysForDomesticDelivery'),
                'numberOfDaysForInternationalDelivery' => $request->input('formData.numberOfDaysForInternationalDelivery')
            ]);

            // Fetch the updated record from the shipping table

            $updatedShippingRecord = Shipping::first(); // Fetch the updated record



            //shipping record updated successfully, return success message
            return response()->json([
                'message' => 'Shipping record updated successfully',
                'code' => 'success',
                'data' => [
                    'countryOfWarehouseLocation' => $updatedShippingRecord->countryOfWarehouseLocation,
                    'domesticShippingFee' => $updatedShippingRecord->domesticShippingFee,
                    'internationalShippingFee' => $updatedShippingRecord->internationalShippingFee,
                    'numberOfDaysForDomesticDelivery' => $updatedShippingRecord->numberOfDaysForDomesticDelivery,
                    'numberOfDaysForInternationalDelivery' => $updatedShippingRecord->numberOfDaysForInternationalDelivery
                ]
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Something went wrong while updating shipping details',
                'code' => 'error',
                'reason' => $e->getMessage(),
            ]);
        }


    }







    public function editProfile(Request $request)
    {
        try {
            // Validate input
            $request->validate([
                'formData.firstname' => 'required|string',
                'formData.lastname' => 'required|string',
                'formData.email' => 'required|email',
                'formData.password' => 'required|string', // "password" is a field type in HTML, but in Laravel it's a string
                'formData.otp' => 'required|integer',
                'formData.previousEmail' => 'required|email',
            ]);

            $newEmail = $request->input('formData.email');
            $previousEmail = $request->input('formData.previousEmail');

            // Check if new email is already taken by another user
            $existingUser = User::where('email', $newEmail)
                ->where('email', '!=', $previousEmail)
                ->first();

            if ($existingUser) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'The email address is already in use by another account.'
                ]);
            }

            // Get the current user using the previous email
            $user = User::where('email', $previousEmail)->first();

            if (!$user) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'User not found'
                ]);
            }

            // Check if password is correct
            if (!Hash::check($request->input('formData.password'), $user->password)) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Password is incorrect'
                ]);
            }

            // Get and decode the OTP token from header
            $codeFromCookies = $request->header('codeFromCookies');
            $OTP = (int)$request->input('formData.otp');

            if (!$codeFromCookies) {
                return response()->json([
                    'message' => 'The OTP you provided seems to be invalid or expired',
                    'code' => 'invalid-jwt',
                ]);
            }

            // Decode JWT
            $decodeToken = JWT::decode($codeFromCookies, new Key(env('JWT_SECRET'), 'HS256'));
            $decodedToken = $decodeToken->code;

            if ($decodedToken !== $OTP) {
                return response()->json([
                    'message' => 'Invalid OTP',
                    'code' => 'invalid-jwt',
                ]);
            }

            // Update user
            $user->update([
                'firstname' => $request->input('formData.firstname'),
                'lastname' => $request->input('formData.lastname'),
                'email' => $newEmail,
            ]);

            return response()->json([
                'message' => 'Admin record updated successfully',
                'code' => 'success',
                'data' => [
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                ]
            ]);

        } catch (ExpiredException $e) {
            return response()->json([
                'message' => 'The OTP you provided seems to be invalid or expired',
                'code' => 'invalid-jwt',
                'reason' => $e->getMessage(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while updating profile',
                'code' => 'server-error',
                'reason' => $e->getMessage(),
            ]);
        }
    }


}
