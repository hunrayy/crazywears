<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use App\Models\Role;
use App\Models\Admin;

class UserController extends Controller
{
    //
    // public function getAllUsers(Request $request) {
    //     try {
    //         $type = in_array($request->query('type'), ['admins', 'users']) ? $request->query('type') : 'users';
    
    //         // Check if data exists in cache
    //         $cacheKey = ($type == 'admins') ? 'allAdmins' : 'allUsers';
    //         $cachedUsers = Cache::get($cacheKey);
    
    //         if ($cachedUsers) {
    //             return response()->json([
    //                 'message' => "All $type successfully retrieved from cache",
    //                 'code' => 'success',
    //                 'data' => $cachedUsers
    //             ]);
    //         }
    
    //         // No data exists in cache. Query the database for list of users and store in cache
    //         if($type == "admins"){
    //             $allUsers = User::whereHas('admin')->with(['admin.roles'])->get();
    //             foreach ($allUsers as $user) {
    //                 $admin = $user->admin;
    //                 if ($admin) {
    //                     // Get the role names directly from the eager-loaded roles relationship
    //                     $roles = $admin->roles->pluck('name');  // `roles` is already loaded as part of `admin`
    //                     $admin->role_names = $roles;
    //                 }
    //             }
    //         }else{
    //             // Fetch users who do not have an entry in the 'admin' table
    //             $adminUserIds = Admin::pluck('user_id');  // Get the list of user IDs from the admin table
            
    //             $allUsers = User::whereNotIn('id', $adminUserIds)->get();
    //         }   
    
    //         // Cache the result
    //         Cache::put($cacheKey, $allUsers->toArray(), now()->addHour());
    
    //         return response()->json([
    //             'message' => "All $type successfully retrieved from database",
    //             'code' => 'success',
    //             'data' => $allUsers
    //         ]);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'message' => 'An error occurred while fetching all users.',
    //             'code' => 'error',
    //             'data' => 'An error occurred while fetching all users. ' . $e->getMessage()
    //         ]);
    //     }
    // }
















    // public function getAllUsers(Request $request) {
    //     try {
    //         $type = in_array($request->query('type'), ['admins', 'users']) ? $request->query('type') : 'users';
    
    //         // Cache keys
    //         $cacheKey = ($type == 'admins') ? 'allAdmins' : 'allUsers';
    //         $rolesCacheKey = 'allRoles'; // Only used if type is 'admins'
    
    //         // Try getting users from cache
    //         $cachedUsers = Cache::get($cacheKey);
            
    //         $cachedRoles = ($type === 'admins') ? Cache::get($rolesCacheKey) : null;
    
    //         if ($cachedUsers && ($type == 'admins' && $cachedRoles)) {
    //             $response = [
    //                 'message' => "All $type successfully retrieved from cache",
    //                 'code' => 'success',
    //                 'data' => $cachedUsers
    //             ];
    
    //             if ($type === 'admins') {
    //                 $response['adminRoles'] = $cachedRoles;
    //             }
    
    //             return response()->json($response);
    //         }
    
    //         // Not in cache, fetch from DB
    //         // Fetch all roles only when dealing with admins
    //         if ($type == "admins") {
    //             $allUsers = User::whereHas('admin')->with(['admin.roles'])->get();
                
    //             foreach ($allUsers as $user) {
    //                 $admin = $user->admin;
    //                 if ($admin) {
    //                     $admin->role_names = $admin->roles->pluck('name');
    //                 }
    //             }
                
    //             $allRoles = Role::all();
    //             Cache::put($rolesCacheKey, $allRoles->toArray(), now()->addHour());
    //         } else {
    //             $adminUserIds = Admin::pluck('user_id');
    //             $allUsers = User::whereNotIn('id', $adminUserIds)->get();
    //             $allRoles = null;
    //         }
    
    //         // Cache the users
    //         Cache::put($cacheKey, $allUsers->toArray(), now()->addHour());
    
    //         // Build response
    //         $response = [
    //             'message' => "All $type successfully retrieved from database",
    //             'code' => 'success',
    //             'data' => $allUsers
    //         ];
    
    //         if ($type === 'admins') {
    //             $response['adminRoles'] = $allRoles;
    //         }
    
    //         return response()->json($response);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'message' => 'An error occurred while fetching all users.',
    //             'code' => 'error',
    //             'data' => 'An error occurred while fetching all users. ' . $e->getMessage()
    //         ]);
    //     }
    // }







    public function getAllUsers(Request $request)
    {
        try {
            $type = $request->query('type');
            $page = (int) $request->query('page', 1);
            $perPage = (int) $request->query('perPage', 10);

            $validTypes = ['users', 'admins'];
            if (!in_array($type, $validTypes)) {
                return response()->json([
                    "message" => "Invalid user type specified.",
                    "code" => "error",
                ]);
            }

            $cacheKey = $type === 'admins' ? 'allAdmins' : 'allUsers';
            $rolesCacheKey = 'allRoles';

            $cachedUsers = Cache::get($cacheKey);
            $cachedRoles = $type === 'admins' ? Cache::get($rolesCacheKey) : null;

            if ($cachedUsers && ($type === 'users' || ($type === 'admins' && $cachedRoles))) {
                $userCollection = collect($cachedUsers);
            } else {
                if ($type === 'admins') {
                    $allUsers = User::whereHas('admin')->with('admin.roles')->get();

                    foreach ($allUsers as $user) {
                        $admin = $user->admin;
                        if ($admin) {
                            $admin->role_names = $admin->roles->pluck('name');
                        }
                    }

                    $userCollection = $allUsers;
                    Cache::put($cacheKey, $userCollection->toArray(), now()->addHour());

                    $allRoles = Role::all();
                    Cache::put($rolesCacheKey, $allRoles->toArray(), now()->addHour());
                } else {
                    $adminUserIds = Admin::pluck('user_id');
                    $allUsers = User::whereNotIn('id', $adminUserIds)->get();

                    $userCollection = $allUsers;
                    Cache::put($cacheKey, $userCollection->toArray(), now()->addHour());
                }
            }

            // Pagination
            $paginated = collect($userCollection)->slice(($page - 1) * $perPage, $perPage)->values();

            $response = [
                'message' => $cachedUsers
                    ? "All $type retrieved from cache"
                    : "All $type retrieved from database",
                'code' => 'success',
                'data' => [
                    'data' => $paginated,
                    'total' => count($userCollection),
                    'current_page' => $page,
                    'per_page' => $perPage
                ]
            ];

            if ($type === 'admins') {
                $response['adminRoles'] = $cachedRoles ?? $allRoles ?? [];
            }

            return response()->json($response);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching users.',
                'code' => 'error',
                'reason' => $e->getMessage()
            ]);
        }
    }

    
    
    
}