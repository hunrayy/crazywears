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
        Schema::create('failed_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Optional if you prefer UUIDs
            $table->string('flw_ref')->unique();
            $table->string('tx_ref')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('payment_type'); // e.g. "card", "ussd", "bank_transfer"
            $table->string('detailsToken'); // can be a UUID or reference to another table
            $table->integer('attempts')->default(0); // how many retry attempts made
            $table->timestamp('failed_at');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('failed_transactions');
    }
};
