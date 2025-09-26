<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $order;
    public $products;
    public $currency;
    public $status;

    public function __construct($order, $products, $currency, $status)
    {
        $this->order = $order;
        $this->products = $products;
        $this->currency = $currency;
        $this->status = $status;
    }

    public function build()
    {
        $order = $this->order;
        $products = $this->products;
        $currency = $this->currency;
        $status = $this->status;

        $orderSummary = implode('', array_map(function ($item) use ($currency) {
            return "
                <div style='display: flex; border: 1px solid #ddd; border-radius: 10px; padding: 10px; margin-bottom: 20px; background-color: #fafafa; max-width: 320px;'>
                    <img src='{$item['productImage']}' alt='" . htmlspecialchars($item['productName']) . "' style='width: 100%; height: auto; max-width: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px;'>
                    <div style='flex-grow: 1;'>
                        <h4 style='margin: 0; color: #333; font-size: 18px;'>" . htmlspecialchars($item['productName']) . "</h4>
                        <h5 style='margin: 5px 0; color: #777; font-size: 14px;'>Length - " . htmlspecialchars($item['lengthPicked']) . "</h5>
                        <h5 style='margin: 5px 0; color: #777; font-size: 14px;'>Quantity * " . htmlspecialchars($item['quantity']) . "</h5>
                        <h5 style='margin: 5px 0; color: #777; font-size: 14px;'><b>Price:</b> {$item['updatedPrice']}</h5>
                    </div>
                </div>
            ";
        }, $products));

        $postalCodeSection = $order->postalCode ? "<b>Postal code:</b> {$order->postalCode}<br/>" : '';

        // Status-specific label and list section
        $statusLabel = $status === 'delivered' ? 'Delivered' : 'Out for Delivery';
        $dateLabel = $status === 'delivered' ? 'Delivered Date' : 'Out For Delivery Date';
        $happyText = $status === 'delivered' ? 'We hope that everything arrived in great condition and that you are satisfied with your purchase.' : 'Our delivery team is working hard to ensure your order reaches you promptly.';

        $statusList = "
            <ul>
                <li><strong>Tracking ID:</strong> {$order->tracking_id}</li>
                <li><strong>Order Date:</strong> {$order->created_at->format('F j, Y')}</li>
                <li><strong>{$dateLabel}:</strong> {$order->updated_at->format('F j, Y')}</li>
            </ul>
        ";


        $body = "
            <div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
                <h2 style='color: #4CAF50;'>Order Status Update</h2>
                <p style='font-size: 16px;'>
                    <b>Hello {$order->firstname},</b>
                </p>
                <p>
                    We are excited to inform you that your order with Tracking ID: <strong>{$order->tracking_id}</strong> is now <strong>{$statusLabel}</strong>! {$happyText}
                </p>

                <h4>Order Summary:</h4>
                <ul>
                    <li><strong>Tracking ID:</strong> {$order->tracking_id}</li>
                    <li><strong>Order Date:</strong> {$order->created_at->format('F j, Y')}</li>
                    <li><strong>{$dateLabel}:</strong> {$order->updated_at->format('F j, Y')}</li>
                </ul>

                <h4 style='color: #333;'>Product(s) Ordered:</h4>
                <div style='display: flex; flex-wrap: wrap; gap: 10px;'>
                    {$orderSummary}
                </div>
                
                <p>
                    If you have any question or concern, feel free to contact our support team.
                </p>
                <p style='margin-top: 20px;'>
                    Thank you for choosing us!, and we hope you enjoy your purchase!.
                </p>
            </div>
        ";

        return $this->to($order->email)
                    ->subject('Order Status Update')
                    ->html($body);
    }
}
