<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\OldCustomerRepository;
use App\Repositories\VehicleRepository;
use App\Repositories\CustomerRepository;
use Illuminate\Support\Facades\Log;

class OldCustomerController extends Controller
{
    protected $oldCustomerrepo;
    protected $vehiclerepo;
    protected $customerrepo;

    public function __construct(OldCustomerRepository $oldCustomerrepo, VehicleRepository $vehiclerepo, CustomerRepository $customerrepo)
    {
        $this->oldCustomerrepo = $oldCustomerrepo;
        $this->vehiclerepo = $vehiclerepo;
        $this->customerrepo = $customerrepo;
    }

    public function oldCustomerCreate(Request $request)
    {
        $vehicle = $this->vehiclerepo->search($request->vehicle_number, 'vehicle_number');
        Log::info('Vehicle search result', ['vehicle' => $vehicle]);

        if (!$vehicle) {
            Log::error('Vehicle not found', ['vehicle_number' => $request->vehicle_number]);
            return response()->json(['error' => 'Vehicle not found'], 404);
        }

        $old_customer = $this->oldCustomerrepo->create($request->vehicle_number, $vehicle->customer_id);
        Log::info('old_customer', ['old_customer' => json_encode($old_customer)]);

        if ($request->type === 'create&update') {
            $request->validate([
                'first_name' => 'required|string|max:255|regex:/^[a-zA-Z-]+$/',
                'last_name' => 'required|string|max:255|regex:/^[a-zA-Z-]+$/',
                'mobile_number' => 'required|string|unique:customers,mobile_number',
                'email' => 'required|email|unique:customers,email|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
                'dob' => 'required|date',
                'house_number' => 'string|required',
                'street_name' => 'string|required',
                'city' => 'required|string',
                'state' => 'required|string',
            ]);
            Log::info('New formdata', ['formdata' => $request]);
            $data = ["first_name" =>  $request->first_name, "last_name" => $request->last_name, "mobile_number" => $request->mobile_number, "email" => $request->email, "house_number" => $request->house_number, "street_name" => $request->street_name, "city" => $request->city, "state" => $request->state, "dob" => $request->dob, "status" => 'ACTIVE'];
            $customer = $this->customerrepo->create($data);
            $today = now();
            $customer_code = 'EAZYCARE' . $today->format('Ymd') . $customer->customer_id;
            $customer->customer_code = $customer_code;
            $customerId = $customer->customer_id;
            $customer->save();
        } else {
            $customerId = $request->customer_id;
        }

        $updatedVehicle = $this->vehiclerepo->update_customer($request->vehicle_number, $customerId);
        Log::info('updatedVehicle', ['data' => json_encode($updatedVehicle)]);

        return response()->json([
            'message' => 'New Customer Updated Successfully',
            'updatedVehicle' => $updatedVehicle
        ], 200);
    }

    public function getOldVehicles($searchValue)
    {
        Log::info('searchValue', ['searchValue' => json_encode($searchValue)]);
        try {
            $old_vehicles = $this->oldCustomerrepo->search($searchValue, 'customer_id');

            if ($old_vehicles) {

                return response()->json([
                    'old_vehicles' => $old_vehicles
                ], 200);
            } else {
                return response()->json(['message' => 'Old Vehicles not found'], 404);
            }
        } catch (\Exception $e) {

            return response()->json(['message', $e->getMessage()], 500);
        }
    }
}
