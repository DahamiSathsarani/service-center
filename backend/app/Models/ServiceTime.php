<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceTime extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = [
        'in_time',
        'out-time',
        'status',
        'service_no',
        'bay_id'
    ];

    /**
     * relatioship business rules:
     *         - the Service Time belongs to one Service Record
     *         - the Service Record has many Service Times
     */
    function serviceRecord(){
        return $this->belongsTo('App\Models\ServiceRecord','service_no','service_no');
    }
    /**
     * relatioship business rules:
     *         - the Bay  has many  Service Times
     *         - the Service Time  belongs to one Bay
     */
    function bay(){
        return $this->belongsTo('App\Models\Bay','bay_id','bay_id');
    }
}
