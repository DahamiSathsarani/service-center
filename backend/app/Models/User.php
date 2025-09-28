<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'role_id',
        'profile_picture',
        'status'
    ];

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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function getStatuses()
    {
        return ['ACTIVE', 'INACTIVE'];
    }

    public function setStatusAttribute($value)
    {
        if (in_array($value, self::getStatuses())) {
            $this->attributes['status'] = $value;
        } else {
            throw new \InvalidArgumentException("Invalid status value");
        }
    }

    /**
     * relatioship business rules:
     *         - the User can have many ServiceRecords
     *         - the ServiceRecord belongs to one User
     */
    function serviceRecords()
    {
        return $this->hasMany('App\Models\ServiceRecord', 'user_id', 'user_id');
    }

    /**
     * relatioship business rules:
     *         - the User  belongs to one User Role
     *         - the User Role has many User
     */
    function userRole()
    {
        return $this->belongsTo('App\Models\UserRole', 'role_id', 'role_id');
    }
}
