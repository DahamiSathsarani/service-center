<?php

namespace App\Repositories;

use App\Models\PackagePrice;
use Illuminate\Validation\ValidationException;

class PackagePriceRepository
{
    protected $package_prices;

    public function __construct(PackagePrice $package_prices)
    {
        $this->package_prices = $package_prices;
    }

    public function getJobNames()
    {
        return $this->package_prices
            ->select('job_type_id', 'job_name')
            ->distinct()
            ->get()
            ->groupBy('job_type_id')
            ->map(fn($jobs) => $jobs->pluck('job_name')->toArray())
            ->toArray();
    }

    public function getPackagesByJobType($vehicleType, $jobType, $subJobTypes = [])
    {
        return $this->package_prices
            ->where('vehicle_type', $vehicleType)
            ->where('job_type_id', $jobType)
            ->when(!empty($subJobTypes), function ($query) use ($subJobTypes) {
                $query->whereIn('job_name', $subJobTypes);
            })
            ->get();
    }
    public function search($id)
    {
        return $this->package_prices->where(['id' => $id])->first();
    }
}
