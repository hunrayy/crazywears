<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Admin;


class Role extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function users()
    {
        // Inverse of the relationship
        return $this->belongsToMany(User::class, 'admin', 'role_id', 'user_id')
                    ->withTimestamps();
    }

    public function getRoleNameAttribute()
{
    return $this->attributes['name']; // Assuming the 'name' column holds things like 'can-create-product'
}


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
