<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();  // Start the transaction

        try {
            // Check if there are no roles in the database before creating them
            $existingRoles = Role::pluck('name')->toArray();

            $newRoles = [
                'can-create-product',
                'can-edit-product',
                'can-delete-product',
                'can-edit-page',
                'can-process-orders',
                'can-edit-shipping-settings'
            ];

            $rolesToInsert = array_diff($newRoles, $existingRoles);

            foreach ($rolesToInsert as $role) {
                Role::create(['name' => $role]);
            }


            DB::commit();  // Commit the transaction if everything is fine
        } catch (QueryException $e) {
            DB::rollBack();  // Rollback the transaction if there is an error
            // Log the error or handle it as needed
            \Log::error("Error seeding roles: " . $e->getMessage());
            // Optionally rethrow the exception to stop further execution
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();  // Rollback the transaction for any other exception
            \Log::error("Unexpected error seeding roles: " . $e->getMessage());
            throw $e;
        }
    }
}
