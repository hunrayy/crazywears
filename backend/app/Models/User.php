<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


use Illuminate\Support\Str;


class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
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

    // A user can have one admin record (optional)
    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    // User model
    public function roles()
    {
        // Assuming 'admin' is the pivot table with 'user_id' and 'role_id'
        return $this->belongsToMany(Role::class, 'admin', 'user_id', 'role_id')
                    ->withTimestamps();
    }



    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
