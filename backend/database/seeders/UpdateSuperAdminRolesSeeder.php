<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use App\Models\Role;

class UpdateSuperAdminRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all role IDs from the roles table
        $allRoleIds = Role::pluck('id')->toArray();

        // Get the first admin
        $admin = Admin::first();

        // Check if the admin exists
        if ($admin) {
            // Clear the current role_id data and update with all role IDs
            $admin->update(['role_id' => $allRoleIds]);
        }
    }
}
