<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $primaryKey = 'vehicle_number';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $casts = [
        'vehicle_number' => 'string',
    ];
    protected $fillable = [
        'brand',
        'type',
        'engine_number',
        'fuel_type',
        'model',
        'license_expire_date',
        'insurence_expire_date',
        'vehicle_number',
        'customer_id',
        'status'
    ];

    public static function getStatuses()
    {
        return ['ACTIVE', 'INACTIVE'];
    }
    public static function getFuelTypes()
    {
        return ['PETROL', 'DIESEL'];
    }
    public static function getTypes()
    {
        return ['VAN', 'CAR', 'SUV', 'PVAN', 'LORRY'];
    }
    public function setStatusAttribute($value)
    {$value = strtoupper($value);
        if (in_array($value, self::getStatuses())) {
            $this->attributes['status'] = $value;
        } else {
            throw new \InvalidArgumentException("Invalid status value");
        }
    }
    public function setFuelTypeAttribute($value)
    {$value = strtoupper($value);
        if (in_array($value, self::getFuelTypes())) {
            $this->attributes['fuel_type'] = $value;
        } else {
            throw new \InvalidArgumentException("Invalid fuel type value");
        }
    }
    public function setTypeAttribute($value)
    {$value = strtoupper($value);
        if (in_array($value, self::getTypes())) {
            $this->attributes['type'] = $value;
        } else {
            throw new \InvalidArgumentException("Invalid type value");
        }
    }
    /**
     * relatioship business rules:
     *         - the Customer can have many Vehicles
     *         - the Vehicle belongs to one Customer
     */
    function customer()
    {
        return $this->belongsTo('App\Models\Customer', 'customer_id', 'customer_id');
    }

    /**
     * relatioship business rules:
     *         - the Service Record  belongs to one Vehicle
     *         - the Vehicle  has many Service Records
     */
    function serviceRecords()
    {
        return $this->hasMany('App\Models\ServiceRecord', 'vehicle_number', 'vehicle_number');
    }
}
