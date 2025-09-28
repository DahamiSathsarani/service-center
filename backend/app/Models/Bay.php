<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bay extends Model
{
    use HasFactory;

    protected $primaryKey = 'bay_id';
    protected $fillable = [
        'bay_type',
        'bay_no',
        'is_busy',
    ];

    /**
     * relatioship business rules:
     *         - the Service Time belongs to one Bay
     *         - the Bay has many Service Times
     */
    function serviceTimes()
    {
        return $this->hasMany('App\Models\ServiceTime', 'bay_id', 'bay_id');
    }
}
