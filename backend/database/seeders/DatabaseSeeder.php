<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProductsCategorySeeder::class, 
            RoleSeeder::class,
            SuperAdminSeeder::class,
            // ChartSeeder::class,
            // updateSuperAdminRolesSeeder::class,
        ]);
    }
}

// User::factory(10)->create();

// User::factory()->create([
//     'name' => 'Test User',
//     'email' => 'test@example.com',
// ]);