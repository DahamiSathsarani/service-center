<?php

namespace App\Http\Controllers;

use App\Repositories\CustomerRepository;
use App\Repositories\NotificationRepository;
use Illuminate\Http\Request;
use App\Repositories\VehicleRepository;
use App\Repositories\LogRepository;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class VehicleController extends Controller
{
    protected $vehiclerepo;
    protected $logrepo;
    protected $notificationRepository;
    protected $customerrepo;
    public function __construct(VehicleRepository $vehiclerepo, LogRepository $logrepo, NotificationRepository $notificationRepository, CustomerRepository $customerrepo)
    {
        $this->vehiclerepo = $vehiclerepo;
        $this->logrepo = $logrepo;
        $this->notificationRepository = $notificationRepository;
        $this->customerrepo = $customerrepo;
    }

    public function vehicleCreation(Request $request)
    {
        try {
            $request->validate([
                'vehicle_number' => 'required|string|unique:vehicles,vehicle_number',
                'type' => 'required|string',
                'brand' => 'required|string',
                'model' => 'required|string',
                'fuel_type' => 'required|string',
                'engine_number' => 'required|string',
                'license_expire_date' => 'required|date',
                'insurence_expire_date' => 'required|date',
            ]);
            if ($request->userRole == 1) {
                $customer = $this->customerrepo->search($request->mobile_number, 'phone_number');
                if ($customer) {
                    $data = ['vehicle_number' => $request->vehicle_number, 'type' => $request->type, 'brand' => $request->brand, 'model' => $request->model, 'fuel_type' => $request->fuel_type, 'engine_number' => $request->engine_number, 'license_expire_date' => $request->license_expire_date, 'insurence_expire_date' => $request->insurence_expire_date, 'customer_id' => $customer->customer_id, 'status' => 'ACTIVE'];
                    $vehicle = $this->vehiclerepo->create($data);
                    if ($vehicle) {
                        $this->logrepo->create('Create', 'Vehicle', "Vehicle created successfully ({$vehicle->vehicle_number})");

                        return response()->json([
                            'message' => 'Vehicle saved successfully!',
                            'vehicle' => $vehicle
                        ], 201);
                    }
                }
                return response()->json(['message' => 'customer not found'], 404);
            } else {
                $data = ['vehicle_number' => $request->vehicle_number, 'type' => $request->type, 'brand' => $request->brand, 'model' => $request->model, 'fuel_type' => $request->fuel_type, 'engine_number' => $request->engine_number, 'license_expire_date' => $request->license_expire_date, 'insurence_expire_date' => $request->insurence_expire_date, 'customer_id' => $request->customer_id, 'status' => 'ACTIVE'];
                Log::info('Vehicle data', ['vehicle' => $data]);
                $vehicle = $this->vehiclerepo->create($data);
                if ($vehicle) {
                    $this->logrepo->create('Create', 'Vehicle', "Vehicle created successfully ({$vehicle->vehicle_number})");

                    return response()->json([
                        'message' => 'Vehicle saved successfully!',
                        'vehicle' => $vehicle
                    ], 201);
                }
            }
        } catch (\Exception $e) {
            return response()->json(['message', $e->getMessage()], 500);
        }
    }
    public function vehicleSearch(Request $request)
    {
        try {
            $vehicle = $this->vehiclerepo->search($request->value, 'vehicle_number');
            if ($vehicle) {
                $userId = $request->user()->user_id;
                $message = "Vehicle search performed for: " . $vehicle->vehicle_number;

                $this->notificationRepository->createNotification($userId, $message);

                return response()->json([
                    'vehicle' => $vehicle
                ], 200);
            } else {
                return response()->json(['message' => 'Vehicle not found'], 404);
            }
        } catch (\Exception $e) {
            $userId = $request->user()->user_id;
            $message = "An error occurred during vehicle search: " . $e->getMessage();
            $this->notificationRepository->createNotification($userId, $message);

            return response()->json(['message', $e->getMessage()], 500);
        }
    }

    public function specificCustomerVehiclesView(Request $request)
    {
        try {
            $vehicles = $this->vehiclerepo->search($request->value, 'customer_id');

            if ($vehicles->isEmpty()) {
                return response()->json(['message' => 'No vehicles found for this customer.'], 404);
            }

            return response()->json([
                'vehicles' => $vehicles
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function get_all()
    {
        try {
            $vehicles = $this->vehiclerepo->get_all();
            return response()->json(['vehicle' => $vehicles], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function update_vehicle_details(Request  $request)
    {
        try {
            if ($request->status === 'ACTIVE' || $request->status === 'INACTIVE') {
                $this->vehiclerepo->update(['vehicle_number' => $request->vehicle_number], ['status' => $request->status]);
                return response()->json(['message' => 'Record update successfully'], 200);
            } else {
                $customer = $this->customerrepo->search($request->mobile_number, 'phone_number');
                if ($customer) {
                    $request->validate([
                        'type' => 'required|string',
                        'brand' => 'required|string',
                        'model' => 'required|string',
                        'fuel_type' => 'required|string',
                        'engine_number' => 'required|string',
                        'license_expire_date' => 'required|date',
                        'insurence_expire_date' => 'required|date',
                        'mobile_number' => ['required', 'string', Rule::unique('customers', 'mobile_number')->ignore(optional($customer)->customer_id, 'customer_id')],
                    ]);
                    $data = ['type' => $request->type, 'brand' => $request->brand, 'model' => $request->model, 'fuel_type' => $request->fuel_type, 'engine_number' => $request->engine_number, 'license_expire_date' => $request->license_expire_date, 'insurence_expire_date' => $request->insurence_expire_date, 'customer_id' => $customer->customer_id, 'status' => 'ACTIVE'];
                    $this->vehiclerepo->update(['vehicle_number' => $request->vehicle_number], $data);
                    return response()->json(['message' => 'Record update successfully'], 200);
                }
                return response()->json(['message' => "customer not found"], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
