<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Repositories\CustomerRepository;
use App\Repositories\LogRepository;
use App\Repositories\VehicleRepository;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
{
    protected $customerrepo;
    protected $logrepo;
    protected $vehiclerepo;
    public function __construct(CustomerRepository $customerrepo, LogRepository $logrepo, VehicleRepository $vehiclerepo)
    {
        $this->customerrepo = $customerrepo;
        $this->logrepo = $logrepo;
        $this->vehiclerepo = $vehiclerepo;
    }

    public function customerCreation(Request $request)
    {

        try {
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
            $customerData = array_merge($request->all(), ['status' => 'ACTIVE']);
            $customer = $this->customerrepo->create($customerData);
            $this->logrepo->create('Create', 'Customer', "Customer created successfully ({$customer->mobile_number})");
            return response()->json([
                'message' => 'Customer Created Successfully!',
                'customer' => $customer
            ], 200);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->json(['message', $e->getMessage()], 500);
        }
    }

    public function customerSearch(Request $request)
    {
        try {
            $customer = $this->customerrepo->search($request->phone_number, 'phone_number');

            if ($customer) {
                return response()->json([
                    'id' => $customer->customer_id
                ], 200);
            } else {
                return response()->json(['message', 'not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message', $e->getMessage()], 500);
        }
    }

    public function customerView(Request $request)
    {
        try {
            $customer = $this->customerrepo->search($request->id, 'id');

            if ($customer) {
                return response()->json([
                    'customer' => $customer
                ], 200);
            } else {
                return response()->json(['message', 'not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message', $e->getMessage()], 500);
        }
    }
    public function get_all_customers_details()
    {
        try {
            $customers = $this->customerrepo->get_all();
            if ($customers) {
                return response()->json([
                    'customers' => $customers
                ], 200);
            }
            return response()->json([
                'message' => "record not found"
            ], 404);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    public function update_customer_details(Request $request)
    {
        if ($request->status === 'ACTIVE' || $request->status === 'INACTIVE') {
            try {
                $data = ['status' => $request->status];
                $customer = $this->customerrepo->update(['customer_id' => $request->customer_id], $data);
                $vehicles = $this->vehiclerepo->search($request->customer_id, 'customer_id');
                if ($vehicles) {
                    foreach ($vehicles as $vehicle) {
                        $this->vehiclerepo->update(['vehicle_number' => $vehicle->vehicle_number], ['status' => 'INACTIVE']);
                    }
                }
                return response()->json([
                    'customer' => $customer
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            try {
                $customer = $this->customerrepo->search($request->customer_id, 'id');
                if ($customer) {
                    $request->validate([
                        'first_name' => 'required|string|max:255|regex:/^[a-zA-Z-]+$/',
                        'last_name' => 'required|string|max:255|regex:/^[a-zA-Z-]+$/',
                        'mobile_number' => ['required', 'string', Rule::unique('customers', 'mobile_number')->ignore(optional($customer)->customer_id, 'customer_id')],
                        'email' => ['required', 'email', Rule::unique('customers', 'email')->ignore(optional($customer)->customer_id, 'customer_id'), 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'],
                        'dob' => 'required|date',
                        'house_number' => 'string|required',
                        'street_name' => 'string|required',
                        'city' => 'required|string',
                        'state' => 'required|string',
                    ]);
                    $data = ['first_name' => $request->first_name, 'last_name' => $request->last_name, 'mobile_number' => $request->mobile_number, 'email' => $request->email, 'house_number' => $request->house_number, 'street_name' => $request->street_name, 'city' => $request->city, 'state' => $request->state, 'dob' => $request->dob];
                    $customer = $this->customerrepo->update(['customer_id' => $request->customer_id], $data);
                    return response()->json([
                        'customers' => $customer
                    ], 200);
                }
                return response()->json([
                    'message' => "record not found"
                ], 404);
            } catch (ValidationException $e) {
                return response()->json(["errors" => $e->errors()], 422); // Return validation errors
            } catch (\Exception $e) {
                return response()->json(["message" => $e->getMessage()], 500);
            }
        }
    }
}
