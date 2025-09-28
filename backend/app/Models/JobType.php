<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobType extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $fillable = [
        'job_type',
        'status',
    ];

    function PackagePrice(){
        return $this->hasMany('App\Models\PackagePrice','job_type_id','id');
    }
}
