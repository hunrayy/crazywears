<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {

            $table->uuid('id')->primary();

            // Product core
            $table->string('productName')->index();
            $table->text('mainProductMedia'); // image or video URL

            // Category relationship
            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('products_category')
                  ->nullOnDelete();

            // Flexible media
            $table->json('subMedia')->nullable();

            // Flexible pricing
            $table->json('productPrices');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};