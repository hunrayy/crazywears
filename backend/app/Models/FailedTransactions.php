<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str; 


class FailedTransactions extends Model
{
    use HasFactory;

    // Specify the table name if it's not the plural of the model name
    protected $table = 'failed_transactions';
    public $timestamps = false;

    protected $fillable = [
        'flw_ref',
        'tx_ref',
        'amount',
        'payment_type',
        'detailsToken',
        'attempts',
        'failed_at',
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
