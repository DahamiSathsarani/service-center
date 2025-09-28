<?php

namespace App\Repositories;

use App\Models\Vehicle;
use Illuminate\Validation\ValidationException;

class VehicleRepository
{
    protected $vehicles;

    public function __construct(Vehicle $vehicles)
    {
        $this->vehicles = $vehicles;
    }

    public function create($data)
    {
        try {
            return $this->vehicles::create($data);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function search($value, $type)
    {
        if ($type == 'vehicle_number') {
            return $this->vehicles::where(['vehicle_number' => $value, 'status' => 'ACTIVE'])->with('customer')->first();
        } elseif ($type == 'customer_id') {
            return $this->vehicles::where(['customer_id' => $value, 'status' => 'ACTIVE'])->get();
        }
    }

    public function update_customer($vehicle_number, $customer_id)
    {
        $vehicle = Vehicle::where('vehicle_number', $vehicle_number)->first();

        if (!$vehicle) {
            throw new \Exception("Vehicle not found");
        }

        $vehicle->customer_id = $customer_id;
        $vehicle->save();

        return $vehicle;
    }
    public function get_all()
    {
        return $this->vehicles->with('customer')->get();
    }
    public function update($condition, $value)
    {
        $this->vehicles->where($condition)->update($value);
    }
}
