<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderReceiptMail;

class MailController extends Controller
{
    public function sendOrderReceipt(Request $request)
    {
        $email = $request->input('email');
        $subject = $request->input('subject');
        $body = $request->input('body');

        Mail::to($email)->queue(new OrderReceiptMail($subject, $body));

        return response()->json(['message' => 'Email queued for sending.']);
    }
}
