<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\ServiceRecordsPackageRepository;
use App\Repositories\VehicleRepository;
use App\Repositories\PackagePriceRepository;
use App\Repositories\ServiceRecordRepository;
use Illuminate\Support\Facades\Log;
use App\Repositories\LogRepository;

class ServiceRecordPackageController extends Controller
{
    protected $serviceRecordPackagerepo;
    protected $vehiclerepo;
    protected $packagepricerepo;
    protected $servicerecordrepo;
    protected $logrepo;

    public function __construct(ServiceRecordsPackageRepository $serviceRecordPackagerepo, VehicleRepository $vehiclerepo, PackagePriceRepository $packagepricerepo, ServiceRecordRepository $servicerecordrepo, LogRepository $logrepo)
    {
        $this->serviceRecordPackagerepo = $serviceRecordPackagerepo;
        $this->vehiclerepo = $vehiclerepo;
        $this->packagepricerepo = $packagepricerepo;
        $this->servicerecordrepo = $servicerecordrepo;
        $this->logrepo = $logrepo;
    }

    public function serviceRecordPackageCreation(Request $request)
    {
        $vehicle = $this->vehiclerepo->search($request->vehicle_number, 'vehicle_number');
        Log::info('Vehicle search result', ['vehicle' => $vehicle]);

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }

        $service_record_data = [
            'vehicle_number' => $request->vehicle_number,
            'customer_id' => $vehicle->customer_id,
            'user_id' => Auth::id(),
            'note' => $request->note,
            'odometer' => $request->odometer,
        ];

        Log::info('service_record_data', ['service_record_data' => json_encode($service_record_data)]);
        $existingRecord = $this->servicerecordrepo->search(['vehicle_number' => $request->vehicle_number, 'status' => 'ONGOING']);
        if ($existingRecord) {
            return response()->json(['error' => 'A service job is already ongoing'], 400);
        }
        $service_record = $this->servicerecordrepo->create($service_record_data);
        Log::info('Retrieved service_record', ['service_record' => json_encode($service_record)]);

        $this->logrepo->create('Create', 'Service Record', "Service record is created with PENDING status ({$service_record->service_no})");

        $data = $this->packagepricerepo->getPackagesByJobType($vehicle->type, $request->jobType, $request->subJobTypes);
        Log::info('Retrieved packages', ['data' => json_encode($data)]);

        if (!$data || $data->isEmpty()) {
            Log::error('No package data found', ['vehicle_type' => $vehicle->type, 'job_type' => $request->jobType]);
            return response()->json(['error' => 'No package data found'], 404);
        }

        $serviceRecordPackage = $this->serviceRecordPackagerepo->create($data, $service_record->service_no);
        Log::info('Retrieved service record packages', ['data' => json_encode($serviceRecordPackage)]);

        foreach ($serviceRecordPackage as $package) {
            $jobName = $package->package->job_name;
            Log::info('jobName', ['jobName' => json_encode($jobName)]);
            $this->logrepo->create('Create', 'Service Record Pckage', "Package: ({$package->package->job_name}) is added to ({$service_record->service_no}) service with PENDING status");
        }

        return response()->json([
            'message' => 'Service record package created successfully',
            'service_record' => $service_record
        ], 201);
    }
}
