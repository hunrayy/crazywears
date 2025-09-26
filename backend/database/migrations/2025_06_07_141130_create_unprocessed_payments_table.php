<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('unprocessed_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('address');
            $table->string('city');
            $table->string('postalCode')->nullable();
            $table->string('phoneNumber');
            $table->string('country');
            $table->string('state');
            $table->decimal('totalPrice', 10, 2);
            $table->decimal('shippingFee', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->json('cartProducts');
            $table->string('currency', 3);
            $table->string('expectedDateOfDelivery');
            $table->string('transactionId');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unprocessed_payments');
    }
};
