<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    protected $primaryKey = 'permission_id';
    protected $fillable = [
        'value',
    ];


    /**
     * relatioship business rules:
     *         - the User Role  belongs to one  Permission
     *         - the Permission  has many User Roles
     */
    function userRoles(){
        return $this->hasMany('App\Models\UserRole','permission_id','permission_id');
    }
}

