<?php 
namespace App\Models; 

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\Model; 

class VehicleInventory extends Model { 
    use HasFactory; 
    
    protected $primaryKey = 'id'; 
    
    protected $fillable = [ 
        'service_no', 
        'item', 
        'no_of_items_in', 
        'no_of_items_out' 
    ]; 

    public function serviceRecord() { 
        return $this->belongsTo('App\Models\ServiceRecord', 'service_no', 'service_no'); 
    } 
}
