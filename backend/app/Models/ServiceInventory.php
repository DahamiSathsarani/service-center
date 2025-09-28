<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceInventory extends Model
{
    use HasFactory;
    protected $primaryKey = 'service_inventory_id';
    protected $fillable = [
        'item_name',
        'quantity',
        'item_code',
        'price',
        'type'
    ];


    /**
     * relatioship business rules:
     *         - the Service Inventory  has many  Inspections
     *         - the Inspection  belongs to one Service Inventory
     */
    function inspections()
    {
        return $this->hasMany('App\Models\Inspection', 'service_inventory_id', 'service_inventory_id');
    }
}
