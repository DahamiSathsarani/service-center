<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $primaryKey = 'customer_id';
    protected $fillable = [
        'first_name',
        'last_name',
        'mobile_number',
        'email',
        'house_number',
        'street_name',
        'city',
        'state',
        'dob',
        'status'
    ];
    protected $cast = [
        'dob' => 'date',
        'status' => 'string'
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
     *         - the Customer can have many ServiceRecords
     *         - the ServiceRecord belongs to one Customer
     */
    function serviceRecords()
    {
        return $this->hasMany('App\Models\ServiceRecord', 'customer_id', 'customer_id');
    }

    /**
     * relatioship business rules:
     *         - the Customer can have many Vehicles
     *         - the Vehicle belongs to one Customer
     */
    function vehicles()
    {
        return $this->hasMany('App\Models\Vehicle', 'customer_id', 'customer_id');
    }
}
