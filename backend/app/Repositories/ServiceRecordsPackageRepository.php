<?php

namespace App\Repositories;

use App\Models\ServiceRecordsPackage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class ServiceRecordsPackageRepository {
    protected $service_record_package;

    public function __construct(ServiceRecordsPackage $service_record_package)
    {
        $this->service_record_package = $service_record_package;
    }

    public function create($packages, $service_no)
    {
        try {
            $records = [];
            foreach ($packages as $package) {

                $records[] = ServiceRecordsPackage::create([
                    'package_id' => $package->id ?? null,
                    'service_no' => $service_no,
                    'status' => 'PENDING'
                ]);
            }

            return ServiceRecordsPackage::with(['package', 'service'])
            ->where('service_no', $service_no)
            ->get();

        } catch (ValidationException $e) {
            Log::error('Validation error in create()', ['errors' => $e->errors()]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Exception in create()', ['message' => $e->getMessage()]);
            throw $e;
        }
    }

   public function search($record_id){
    return $this->service_record_package->where(['service_no'=>$record_id])->get();
   }

   public function update($data, $stage)
    {
        if ($stage == 'status') {
            $this->service_record_package
            ->where('service_no', $data['service_no'])
            ->update(['status' => $data['status']]);
        } 

        return false;
    }
}
