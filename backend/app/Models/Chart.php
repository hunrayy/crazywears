<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Chart extends Model
{
    use HasFactory;
    protected $table = 'chart';
    protected $fillable = [
        'date',
        'ips'
    ];

    protected $casts = [
        'ips' => 'array', // Automatically convert JSON to array when accessed
        'date' => 'date', // Ensures the `date` field is treated as a Carbon date
    ];
    
    public function getDateAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d-m-Y');
    }


    // protected function date(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn ($value) => Carbon::parse($value)->format('d-m-Y')
    //     );
    // }

    // protected function date(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn ($value) => \Carbon\Carbon::parse($value)->format('d-m-Y'),
    //     );
    // }

    // protected function serializeDate(\DateTimeInterface $date)
    // {
    //     // Format date as 'd-m-Y' (e.g., 03-05-2025)
    //     return $date->format('d-m-Y');
    // }
}
