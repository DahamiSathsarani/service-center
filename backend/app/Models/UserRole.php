<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;
    protected $primaryKey = 'role_id';
    protected $fillable = [
        'role_name',
    ];

    /**
     * relatioship business rules:
     *         - the User Role can have many Users
     *         - the User belongs to one User Role
     */
    function users(){
        return $this->hasMany('App\Models\User','role_id','role_id');
    }

     /**
     * relatioship business rules:
     *         - the User Role can have one  Permission
     *         - the Permission has many User Role
     */
    function permission(){
        return $this->belongsTo('App\Models\Permission','permission_id','permission_id');
    }
}
