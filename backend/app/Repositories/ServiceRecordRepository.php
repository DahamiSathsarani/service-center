<?php

namespace App\Repositories;

use App\Models\ServiceRecord;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;


class ServiceRecordRepository
{
    protected $service_records;

    public function __construct(ServiceRecord $service_records)
    {
        $this->service_records = $service_records;
    }

    public function create($data)
    {
        try {
            return $this->service_records->create([
                'user_id' => $data['user_id'],
                'customer_id' => $data['customer_id'],
                'vehicle_number' => $data['vehicle_number'],
                'odometer' => $data['odometer'],
                'notes' => $data['note'],
                'date' => now()->toDateString(),
                'time' => now()->toTimeString(),
                'status' => 'PENDING',
            ]);
        } catch (ValidationException $e) {
            Log::error('Validation error in create()', ['errors' => $e->errors()]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Exception in create()', ['message' => $e->getMessage()]);
            throw $e;
        }
    }

    public function update($data, $stage)
    {
        if ($stage == 'damage_marking') {
            return $this->service_records
                ->where('service_no', $data['service_no'])
                ->update(['damages' => $data['image_path']]);
        } elseif ($stage == 'signing') {
            return $this->service_records
                ->where('service_no', $data['service_no'])
                ->update($data['data']);
        } elseif ($stage == 'status') {
            $this->service_records
                ->where('service_no', $data['service_no'])
                ->update(['status' => $data['status'], 'price' => $data['price']]);
        }

        return false;
    }
    public function search($data)
    {
        return $this->service_records->with(['vehicle', 'customer', 'user', 'ServiceRecordsPackage.package.JobType', 'vehicleInventorys', 'serviceTimes', 'vehicleHandovers', 'inspections.serviceInventory'])->where($data)->first();
    }

    public function get($data, $type)
    {
        if ($type == 'completed') {
            return $this->service_records->with(['vehicle', 'customer', 'ServiceRecordsPackage.package.JobType'])
                ->where($data)->orderByDesc('date')->orderByDesc('time')->get();
        } elseif ($type == 'ongoing') {
            return $this->service_records::where('status', 'ONGOING')
                ->with(['serviceTimes.bay', 'vehicle', 'customer'])->orderByDesc('date')->orderByDesc('time')
                ->get();
        } elseif ($type == 'odometer') {
            return $this->service_records::where('vehicle_number', $data)
                ->latest()
                ->first();
        } elseif ($type == 'completed_admin') {
            return $this->service_records::where('status', 'COMPLETED')
                ->with(['vehicle', 'customer', 'ServiceRecordsPackage.package.JobType'])
                ->get();
        } elseif ($type == 'stats') {
            return $this->service_records::with(['vehicle', 'customer', 'ServiceRecordsPackage.package.JobType'])
                ->where('status', 'COMPLETED')
                ->whereBetween('date', [$data['from_date'], $data['to_date']])
                ->get();
        }
    }
    public function get_all()
    {
        return $this->service_records->with(['customer', 'vehicle'])->get();
    }
}
