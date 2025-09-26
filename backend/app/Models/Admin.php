<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Admin extends Model
{
    use HasFactory;
    protected $table = 'admin'; // This ensures the model uses the 'admin' table

    protected $fillable = ['user_id', 'role_id'];
    
    protected $casts = [
        'role_id' => 'array',
    ];
    

    //override the getIncrementing method
    public $incrementing = false;

    //set the key type to string
    protected $keyType = 'string';
    
    // Automatically create a UUID when inserting
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    // Relationship with User (Admin belongs to User)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Role (fetch roles based on role_id)
    public function roles()
    {
        $roleIds = json_decode($this->role_id);

        // Ensure roleIds is valid and not empty
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($roleIds) || empty($roleIds)) {
            // Return an empty collection safely
            return $this->belongsToMany(Role::class, 'admin', 'user_id', 'role_id')->whereRaw('1 = 0');
        }

        // Use the belongsToMany relationship and ensure no duplicate table aliases
        // return $this->belongsToMany(Role::class, 'roles', 'admin_id', 'role_id')->whereIn('roles.id', $roleIds);
        return $this->belongsToMany(Role::class, 'admin', 'user_id', 'role_id')
                ->withTimestamps();
    }

    

    // // Many-to-many relationship with Role
    // public function roles()
    // {
    //     return $this->belongsToMany(Role::class, 'admin_role', 'admin_id', 'role_id');
    // }
    // Accessor to get roles as a collection of role objects
    public function getRolesAttribute()
    {
        // Check if role_id is a string and decode it only if needed
        $roleIds = is_string($this->role_id) ? json_decode($this->role_id) : $this->role_id;

        // Ensure it's an array (in case role_id is not valid JSON or is an array of IDs)
        return Role::whereIn('id', (array) $roleIds)->get();
    }

}
