<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inspection extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = [
        'item',
        'remark',
        'quantity',
        'service_no',
        'service_inventory_id',
        'comment',
        'price'
    ];

    /**
     * relatioship business rules:
     *         - the Inspection belongs to one Service Record
     *         - the Service Record has many Inspections
     */
    function serviceRecord()
    {
        return $this->belongsTo('App\Models\ServiceRecord', 'service_no', 'service_no');
    }

    /**
     * relatioship business rules:
     *         - the Service Inventory  has many  Inspections
     *         - the Inspection  belongs to one Service Inventory
     */
    function serviceInventory()
    {
        return $this->belongsTo('App\Models\ServiceInventory', 'service_inventory_id', 'service_inventory_id');
    }
}
