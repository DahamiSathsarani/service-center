<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRecordsPackage extends Model
{
    use HasFactory;

    protected $table = 'service_records_packages';

    protected $fillable = [
        'service_no',
        'package_id',
        'status',
    ];

    public function service()
    {
        return $this->belongsTo(ServiceRecord::class, 'service_no');
    }

    public function package()
    {
        return $this->belongsTo(PackagePrice::class, 'package_id');
    }
}
