<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'productName',
        'mainProductMedia',
        'category_id',
        'subMedia',
        'productPrices'
    ];
    

    // Disable the auto-incrementing feature
    public $incrementing = false;

    // Set the key type to string
    protected $keyType = 'string';

    protected $casts = [
        'subMedia' => 'array',
        'productPrices' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Automatically set the id to a new UUID when creating
            $model->id = (string) Str::uuid();
        });
    }

    // Define the relationship to ProductCategory
    public function category()
    {
        return $this->belongsTo(ProductsCategory::class);
    }
}
    