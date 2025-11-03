<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Repositories\CustomerRepository;
use App\Repositories\LogRepository;
use App\Repositories\VehicleRepository;
use App\Repositories\OtpRepository;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use App\Helpers\SmsHelper;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    protected $customerrepo;
    protected $logrepo;
    protected $vehiclerepo;
    protected $otprepo;

    public function __construct(CustomerRepository $customerrepo, LogRepository $logrepo, VehicleRepository $vehiclerepo, OtpRepository $otprepo)
    {
        $this->customerrepo = $customerrepo;
        $this->logrepo = $logrepo;
        $this->vehiclerepo = $vehiclerepo;
        $this->otprepo = $otprepo;
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
                'street_name' => 'string',
                'city' => 'string',
                'state' => 'string',
            ]);
            $customerData = array_merge($request->all(), ['status' => 'ACTIVE']);
            $customer = $this->customerrepo->create($customerData);
            $today = now();
            $customer_code = 'EAZYCARE' . $today->format('Ymd') . $customer->customer_id;
            $customer->customer_code = $customer_code;
            $customer->save();
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
            $mobile = $request->phone_number;

            if (str_starts_with($mobile, '0')) {
                $mobile = '94' . substr($mobile, 1);
            }

            $customer = $this->customerrepo->search($mobile, 'phone_number');

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

    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|min:9|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mobile = $request->mobile_number;

        if (str_starts_with($mobile, '0')) {
            $mobile = '94' . substr($mobile, 1);
        }

        $otp = rand(100000, 999999);

        $this->otprepo->deleteOtps($mobile);
        $this->otprepo->saveOtp($mobile, $otp);

        $message = "Your verification code is: $otp. It will expire in 2 minutes.";
        $response = SmsHelper::sendSms($mobile, $message);

        return response()->json([
            'message' => 'OTP sent successfully',
            'response' => $response
        ], 200);
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|min:10|max:15',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mobile = $request->mobile_number;

        if (str_starts_with($mobile, '0')) {
            $mobile = '94' . substr($mobile, 1);
        }

        $status = $this->otprepo->verifyOtp($mobile, $request->otp);

        switch ($status) {
            case 'valid':
                return response()->json(['message' => 'OTP verified successfully'], 200);
            case 'expired':
                return response()->json(['message' => 'OTP has expired. Please request a new one.'], 400);
            case 'invalid':
                return response()->json(['message' => 'Invalid OTP. Please try again.'], 400);
            case 'not_found':
                return response()->json(['message' => 'No OTP found for this number.'], 404);
            default:
                return response()->json(['message' => 'OTP verification failed.'], 500);
        }
    }

    public function updateMobileNumber(Request $request)
    {
        try {
            $messages = [
                'mobile_number.unique' => 'This mobile number is already registered with another customer.',
            ];

            $request->validate([
                'customer_id' => 'required|exists:customers,customer_id',
                'mobile_number' => [
                    'required',
                    'string',
                    'min:10',
                    'max:15',
                    Rule::unique('customers', 'mobile_number')->ignore($request->customer_id, 'customer_id'),
                ],
            ], $messages);

            $mobile = $request->mobile_number;

            if (str_starts_with($mobile, '0')) {
                $mobile = '94' . substr($mobile, 1);
            }

            $customer = $this->customerrepo->search($request->customer_id, 'id');

            if (!$customer) {
                return response()->json(['message' => 'Customer not found'], 404);
            }

            $this->customerrepo->update(
                ['customer_id' => $request->customer_id],
                ['mobile_number' => $mobile]
            );

            $updatedCustomer = $this->customerrepo->search($request->customer_id, 'id');

            $this->logrepo->create(
                'Update',
                'Customer',
                "Mobile number updated for customer ({$updatedCustomer->customer_id})"
            );

            return response()->json([
                'message' => 'Mobile number updated successfully',
                'customer' => $updatedCustomer
            ], 200);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
