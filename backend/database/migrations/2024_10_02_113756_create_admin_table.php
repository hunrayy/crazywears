<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


return new class extends Migration
{
    /**
     * Run the migrations.
     */

     public function up()
    {
        Schema::create('admin', function (Blueprint $table) {
            $table->uuid('id')->primary();  // UUID type for the primary key
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');  // Foreign key to the 'users' table
            $table->json('role_id');  // Store an array of role IDs in JSON format
            $table->boolean('is_super_admin')->default(false);  // A field to identify the super admin
            $table->timestamps();
        });
    }

    // public function up(): void
    // {
    //     Schema::create('admin', function (Blueprint $table) {
    //         $table->uuid('id')->primary();
    //         $table->string('firstname');
    //         $table->string('lastname');
    //         $table->string('email')->unique();
    //         $table->string('password');
    //         $table->string('user');
    //         $table->boolean('is_an_admin');
    //         $table->timestamps();
    //     });

    //     Admin::create([
    //         'id' => (string) Str::uuid(),
    //         'firstname' => 'john',
    //         'lastname' => 'doe',
    //         'email' => 'johndoe@gmail.com',
    //         'password' => Hash::make('johndoe'),
    //         'user' => 'admin',
    //         'is_an_admin' => true,
    //     ]);

    // }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};
