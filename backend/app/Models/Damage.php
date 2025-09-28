<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Damage extends Model
{
    use HasFactory;

    protected $table = 'damages';

    protected $fillable = [
        'service_no',
        'damage_image',
    ];

    public function service()
    {
        return $this->belongsTo(ServiceRecord::class, 'service_no');
    }
}
