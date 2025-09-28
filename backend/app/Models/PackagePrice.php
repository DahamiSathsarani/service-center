<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackagePrice extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $fillable = [
        'price',
        'job_name',
        'job_type_id',
        'vehicle_type'
    ];


    public function JobType()
    {
        return $this->belongsTo(JobType::class, 'job_type_id');
    }
    function serviceRecordPackages(){
        return $this->hasMany('App\Models\ServiceRecordsPackage','package_id','id');
    }
}
