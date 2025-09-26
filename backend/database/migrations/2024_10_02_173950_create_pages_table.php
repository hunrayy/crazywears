<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Pages;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('page')->index();
            $table->longText('content')->nullable();
            $table->timestamps();
        });

        Pages::insert([
            [
                'id' => (string) Str::uuid(),
                'title' => 'Shipping policy',
                'page' => 'shippingPolicy',
                'content' => '<h2><strong>Shipping policy</strong></h2><p>International customers, please be aware of any custom duties or fees that may apply to your order upon reaching your country. We cannot be held responsible for clearing your order or paying the customs fee if any.</p><p>If you happen to miss your delivery, the courier usually attempts delivery for three consecutive days. If you miss these attempts, please contact us to rearrange shipping. In the event that your tracking info says "returned to sender", there may be an additional shipping fee any.</p><p>Shipping itself is always express/next-day service. However, please keep in mind that there is a standard processing duration of <strong>2-3 working days</strong> on average for our ready-to-ship items. For custom orders and sale orders, the processing duration is typically <strong>4-7 working days</strong>.</p>'
            ],
            [
                'id' => (string) Str::uuid(),
                'title' => 'Refund policy',
                'page' => 'refundPolicy',
                'content' => "<h2><strong>Refund policy</strong></h2><p>All sales are final, and we don't offer refunds or returns as our products bespoke items and are made to order.</p><p>However, you are entitled to a refund or exchange - if you receive the wrong item.</p><p>- If your order was shipped to a different address and not what you filled out. Please contact if you’d like to change your address.</p><p>-In case your order is delayed beyond the 10 working days processing duration during peak times, you can request a refund.</p><p>- Please note that we cannot provide a refund if the delay is due to the courier service, as we have limited control over that situation.</p><p>- Returns and refunds are only accepted under rare circumstances, but please be aware that if you return an order that has been installed, used, lace cut, or passed 7 days since declared delivered, you will not be entitled to a refund.</p><p>Refunds could take up to 10 working days to reflect</p><p>- If your order was shipped to a different address and not what you filled out. Please contact if you’d like to change your address.</p>"
            ],
            [
                'id' => (string) Str::uuid(),
                'title' => 'Delivery policy',
                'page' => 'deliveryPolicy',
                'content' => "<h2><strong>Delivery policy</strong></h2><p>Our delivery charges vary based on your location and the total weight of your order. The exact delivery cost will be calculated at checkout.</p><p>We aim to process and dispatch all orders within 2-3 working days. During peak times or sales, processing may take longer.</p><p>Delivery times depend on your location:</p><p>Local deliveries (within the city): 1-3 working days</p><p>National deliveries: 3-7 working days</p><p>International deliveries: 7-21 working days</p><p>Once your order has been dispatched, you will receive a shipping confirmation email with a tracking number. You can use this to track the status of your delivery.</p><p>We do not offer free delivery. All delivery charges will be clearly stated at checkout before you complete your purchase.</p><p>Please ensure that the delivery address provided is accurate and complete. We are not responsible for any delays or misdeliveries due to incorrect or incomplete addresses.</p><p>If you need to change your delivery address after placing an order, please contact us as soon as possible. Changes to the delivery address cannot be made once the order has been dispatched.</p><p>In case of any delays or issues with delivery, please contact our customer service team for assistance. We will do our best to resolve any problems as quickly as possible.</p><p>By placing an order with us, you agree to our delivery policy and understand the delivery times and charges applicable to your order.</p>"
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
