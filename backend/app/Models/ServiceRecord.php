<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRecord extends Model
{
    use HasFactory;
    protected $primaryKey = 'service_no';
    protected $fillable = [
        'user_id',
        'customer_id',
        'vehicle_number',
        'notes',
        'damages',
        'odometer',
        'status',
        'customer_signature_start',
        'customer_signature_end',
        'date',
        'time',
        'price'
    ];


    function user(){
        return $this->belongsTo('App\Models\User','user_id','user_id');
    }

    function customer(){
        return $this->belongsTo('App\Models\Customer','customer_id','customer_id');
    }

    function vehicle(){
        return $this->belongsTo('App\Models\Vehicle','vehicle_number','vehicle_number');
    }

    function ServiceRecordsPackage(){
        return $this->hasMany('App\Models\ServiceRecordsPackage','service_no','service_no');
    }

    function vehicleInventorys(){
        return $this->hasMany('App\Models\VehicleInventory','service_no','service_no');
    }


    function serviceTimes(){
        return $this->hasMany('App\Models\ServiceTime','service_no','service_no');
    }

    function vehicleHandovers(){
        return $this->hasMany('App\Models\VehicleHandover','service_no','service_no');
    }

    function inspections(){
        return $this->hasMany('App\Models\Inspection','service_no','service_no');
    }
}
