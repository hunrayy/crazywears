<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class UnprocessedPayments extends Model
{
    use HasFactory;

    protected $table = 'unprocessed_payments';

    // The attributes that are mass assignable (for fillable fields)
    protected $fillable = [
        'email',
        'firstname',
        'lastname',
        'address',
        'city',
        'postalCode',
        'phoneNumber',
        'country',
        'state',
        'totalPrice',
        'shippingFee',
        'subtotal',
        'cartProducts',
        'currency',
        'expectedDateOfDelivery',
        'transactionId',
    ];

    // Cast fields to appropriate types
    protected $casts = [
        'totalPrice' => 'decimal:2',
        'shippingFee' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'cartProducts' => 'array', // Laravel automatically casts JSON columns to arrays
    ];



    // Disable the auto-incrementing feature
    public $incrementing = false;

    // Set the key type to string
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Automatically set the id to a new UUID when creating
            $model->id = (string) Str::uuid();
        });
    }
}
