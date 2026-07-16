<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use App\Models\Role;
use App\Models\Admin;
use Illuminate\Support\Facades\Cache;



class VerifyAdminToken
{
    public function handle(Request $request, Closure $next, $permission = null): Response
    {
        try {
            $bearerToken = $request->header('Authorization');
            if (!$bearerToken) {
                return response()->json([
                    'message' => 'You are not logged in. Please sign in to continue.',
                    'code' => 'error',
                    'reason' => 'Authorization token not provided',
                ]);
            }

            $parts = explode(' ', $bearerToken);
            if (count($parts) !== 2 || strtolower($parts[0]) !== 'bearer') {
                return response()->json([
                    'message' => 'Your login session is invalid. Please log in again.',
                    'code' => 'error',
                    'reason' => 'Malformed Authorization header',
                ]);
            }

            $token = $parts[1];

            // Decode JWT
            $payload = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
            $userId = $payload->userId;

            // 🔁 Cache admin lookup
            $admin = Cache::remember("admin_user_{$userId}", now()->addMinutes(10), function () use ($userId) {
                return Admin::where('user_id', $userId)->first();
            });

            if (!$admin) {
                return response()->json([
                    'message' => 'Account not found or access has been removed.',
                    'code' => 'error',
                    'reason' => 'Unauthorized: Admin not found',
                ]);
            }

            // ✅ No specific permission required
            if ($permission === null) {
                return $next($request);
            }

            // 🔁 Cache role lookup
            $role = Cache::remember("role_{$permission}", now()->addHours(1), function () use ($permission) {
                return Role::where('name', $permission)->first();
            });

            if (!$role) {
                return response()->json([
                    'message' => 'This action is not available right now.',
                    'code' => 'error',
                    'reason' => 'Permission role not found',
                ]);
            }

            $userRolesArray = is_string($admin->role_id)
                ? json_decode($admin->role_id, true)
                : $admin->role_id;

            if (!is_array($userRolesArray)) {
                return response()->json([
                    'message' => 'Your account permissions are corrupted. Please contact support.',
                    'code' => 'error',
                    'reason' => 'Invalid role data format',
                ]);
            }

            if (in_array($role->id, $userRolesArray) || $admin->is_super_admin) {
                return $next($request);
            }

            return response()->json([
                'message' => 'Access denied. You are not authorized to perform this action',
                'code' => 'error',
            ]);

        } catch (ExpiredException $e) {
            return response()->json([
                'message' => 'Your session has expired. Please log in again.',
                'code' => 'invalid-jwt',
                'user-friendly-reason' => 'JWT expired',
                'reason' => $e->getMessage(),
            ]);
        } catch (\Exception $e) {
            Log::error('JWT Exception: ' . $e->getMessage());
            return response()->json([
                'message' => 'Something went wrong. Please try again.',
                'code' => 'invalid-jwt',
                'reason' => $e->getMessage(),
            ]);
        }
    }
}

















// class VerifyAdminToken
// {

//     /**
//      * Handle an incoming request.
//      *
//      * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
//      */
//     public function handle(Request $request, Closure $next, $permission = null): Response
//     {
//         try {
//             // Log or use the passed permission string
//             // Log::info('Permission passed to middleware: ' . $permission);

//             // Get the Authorization header
//             $bearerToken = $request->header('Authorization');
//             if (!$bearerToken) {
//                 return response()->json([
//                     'message' => 'Authorization token not provided',
//                     'code' => 'error',
//                 ]);
//             }

//             // Split the token
//             $token = explode(' ', $bearerToken)[1];

//             // Verify the token
//             $payload = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

//             //extract the user's id
//             $userId = $payload->userId;

//             $is_an_admin = Admin::where('user_id', $userId)->first();
//             if($is_an_admin && $permission == null){
//                 return $next($request);
//             }else if ($is_an_admin && $permission !== null) {
//                 //get the id of the role on the roles table 
//                 $searchRole = Role::where('name', $permission)->first();
//                 $roleId = $searchRole->id;
                
//                 // Check user role
//                 $userRolesArray = json_decode($is_an_admin->role_id, true);
//                 // Log::info('User roles array: ' . json_encode($userRolesArray));
//                 if(in_array($roleId, $userRolesArray)|| $is_an_admin -> is_super_admin){

//                     return $next($request);
//                     // if ($permission == 'can-create-product') {
//                     //     // Your logic for this permission, if needed
//                     // }
//                 }else{
//                     return response()->json([
//                         'message' => 'Access denied. you are not authorized to perform this action',
//                         'code' => 'error',
//                     ]); 
//                 }

//             } else {
//                 return response()->json([
//                     'message' => 'Unauthorized',
//                     'code' => 'error',
//                 ]);
//             }

//         } catch (ExpiredException $e) {
//             return response()->json([
//                 'message' => 'Invalid JSON Web Token or JWT expired',
//                 'code' => 'invalid-jwt',
//                 'reason' => $e->getMessage(),
//             ]);
//         } catch (\Exception $e) {
//             Log::error($e->getMessage()); // Log the error message
//             return response()->json([
//                 'message' => 'Invalid JSON Web Token',
//                 'code' => 'invalid-jwt',
//                 'reason' => $e->getMessage(),
//             ]);
//         }
//     }
// }
