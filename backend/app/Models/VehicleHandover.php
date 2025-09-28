<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleHandover extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = [
        'checking_item',
        'name',
        'signature',
        'time',
        'service_no'
    ];

    /**
     * relatioship business rules:
     *         - the Service Record  has two Vehicle Handovers
     *         - the Vehicle Handover belongs to one Service Record
     */
    function serviceRecord(){
        return $this->belongsTo('App\Models\ServiceRecord','service_no','service_no');
    }
}
