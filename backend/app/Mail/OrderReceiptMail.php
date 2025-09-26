<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderReceiptMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $orderDetails;
    public $products;
    public $currency;

    public function __construct($orderDetails, $products)
    {
        $this->orderDetails = $orderDetails;
        $this->products = $products;
        $this->currency = $orderDetails['currency'] ?? 'GBP'; // fallback currency
    }

    public function build()
    {
        $subject = 'Payment Confirmation';

        $orderSummary = '';
        foreach ($this->products as $item) {
            // Format price or convert currency if needed
            $formattedPrice = $this->currency . ' ' . number_format($item->productPrice, 2, '.', ',');
            
            $orderSummary .= "
                <div style='display: flex; border: 1px solid #ddd; border-radius: 10px; padding: 10px; margin-bottom: 20px; align-items: center; background-color: #fafafa;'>
                    <img src='{$item->productImage}' alt='" . htmlspecialchars($item->productName) . "' style='width: 100%; height: auto; max-width: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px;' />
                    <div style='flex-grow: 1;'>
                        <h3 style='margin: 0; color: #333; font-size: 18px;'>" . htmlspecialchars($item->productName) . "</h3>
                        <p style='margin: 5px 0; color: #777; font-size: 14px;'>Length: " . htmlspecialchars($item->lengthPicked) . "</p>
                        <p style='margin: 5px 0; color: #777; font-size: 14px;'>Quantity: " . htmlspecialchars($item->quantity) . "</p>
                        <p style='margin: 5px 0; color: #777; font-size: 14px;'>Price: {$formattedPrice}</p>
                    </div>
                </div>
            ";
        }

        $postalCodeSection = $this->orderDetails['postalCode'] ? "<p style='margin: 5px 0;'><strong>Postal code:</strong> {$this->orderDetails['postalCode']}</p>" : '';

        $formattedTotalPrice = number_format($this->orderDetails['totalPrice']);
        $formattedSubtotal = number_format($this->orderDetails['subtotal']);
        $formattedShippingFee = number_format($this->orderDetails['shippingFee']);

        $body = "
            <div style=font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;'>
                <div style='background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>
                    <div style='text-align: center; margin-bottom: 20px;'>
                        <h1 style='margin: 0; color: #333;'>Your Order Receipt</h1>
                        <p style='margin: 5px 0; color: #777;'>Thank you for shopping with us!</p>
                    </div>

                    <div>
                        <p>Dear {$this->orderDetails['firstname']},</p>
                        <p>Thank you for your payment! We're pleased to inform you that your transaction has been successfully processed.</p>
                    </div>
                    <hr />

                    <div style='display: flex; font-size: 15px;'>
                        <div style='margin-right: 20px; flex: 1;'>
                            <p style='color: purple;'><strong>Order Details</strong></p>
                            <p><strong>Tracking ID:</strong> {$this->orderDetails['tracking_id']}</p>
                            <p><strong>Transaction ID:</strong> {$this->orderDetails['transaction_id']}</p>
                            <p><strong>Phone number:</strong> {$this->orderDetails['phoneNumber']}</p>
                        </div>
                        <div style='flex: 1;'>
                            <p style='color: purple;'><strong>Shipping Details</strong></p>
                            <p><strong>Country:</strong> {$this->orderDetails['country']}</p>
                            <p><strong>State:</strong> {$this->orderDetails['state']}</p>
                            <p><strong>City:</strong> {$this->orderDetails['city']}</p>
                            <p><strong>Address:</strong> {$this->orderDetails['address']}</p>
                            {$postalCodeSection}
                            <p><strong>Expected date of delivery:</strong> {$this->orderDetails['expectedDateOfDelivery']}</p>
                        </div>
                    </div>
                    <hr />
                    <h4 style='font-weight: bold;'>Summary</h4>
                    {$orderSummary}
                    <div style='text-align: right;'>
                        <p style='color: #333;'>Subtotal: {$this->currency} {$formattedSubtotal}</p>
                        <p style='color: #333;'>Shipping Fee: {$this->currency} {$formattedShippingFee}</p>
                        <p style='color: #333;'><strong>Total: {$this->currency} {$formattedTotalPrice}</strong></p>
                    </div>

                    <div style='background: purple; padding: 10px; text-align: center; color: white; margin-top: 20px;'>
                        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                        <p>Thank you for choosing us! We look forward to serving you again.</p>
                    </div>
                </div>
            </div>
        ";

        return $this->subject($subject)
                    ->html($body);
    }
}

