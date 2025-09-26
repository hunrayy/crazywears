<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();  // Start the transaction

        try {
            // Check if this is the first admin
            $isFirstAdmin = Admin::count() === 0;

            if ($isFirstAdmin && User::count() === 0) {
                // Create the Super Admin user
                $superAdmin = User::create([
                    'firstname' => env('Super_Admin_Firstname'),
                    'lastname' => env('Super_Admin_Lastname'),
                    'email' => env('Super_Admin_Email'),
                    'password' => Hash::make(env('Super_Admin_Password'))
                ]);

                // Get all role IDs (this assumes roles are already created in the roles table)
                $roleIds = Role::all()->pluck('id')->toArray();

                // Create the admin record, linking it to the super admin user
                $admin = Admin::create([
                    'user_id' => $superAdmin->id,  // Reference the user_id from the created User model
                    'role_id' => json_encode($roleIds),
                    'is_super_admin' => $isFirstAdmin
                ]);
            }

            DB::commit();  // Commit the transaction if all goes well
        } catch (QueryException $e) {
            DB::rollBack();  // Rollback the transaction if there is an error
            // Log the error or handle it in a way that fits your application
            \Log::error("Error seeding SuperAdmin: " . $e->getMessage());
            // Optionally rethrow the exception if needed
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();  // Rollback the transaction for any other exceptions
            \Log::error("Unexpected error seeding SuperAdmin: " . $e->getMessage());
            throw $e;
        }
    }
}
