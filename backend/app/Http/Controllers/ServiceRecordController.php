<?php

namespace App\Http\Controllers;

use App\Repositories\CustomerRepository;
use Illuminate\Support\Facades\Auth;
use App\Repositories\PackagePriceRepository;
use Illuminate\Http\Request;
use App\Repositories\ServiceRecordRepository;
use App\Repositories\ServiceRecordsPackageRepository;
use App\Repositories\VehicleRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Repositories\LogRepository;
use Carbon\Carbon;
use App\Repositories\DamageRepository;
use App\Repositories\InspectionRepository;
use App\Repositories\ServiceInventoryRepository;
use App\Helpers\SmsHelper;

class ServiceRecordController extends Controller
{
    protected $servicerecordrepo;
    protected $vehiclerepo;
    protected $customerrepo;
    protected $serviceRecordPackagerepo;
    protected $packagepricerepo;
    protected $logrepo;
    protected $damageImagesrepo;
    protected $inspectionrepo;
    protected $serviceinventoryrepo;

    public function __construct(ServiceRecordRepository $servicerecordrepo, VehicleRepository $vehiclerepo, PackagePriceRepository $packagepricerepo, LogRepository $logrepo, ServiceRecordsPackageRepository $serviceRecordPackagerepo, DamageRepository $damageImagesrepo, InspectionRepository $inspectionrepo, ServiceInventoryRepository $serviceinventoryrepo, CustomerRepository $customerrepo)
    {
        $this->servicerecordrepo = $servicerecordrepo;
        $this->vehiclerepo = $vehiclerepo;
        $this->packagepricerepo = $packagepricerepo;
        $this->logrepo = $logrepo;
        $this->serviceRecordPackagerepo = $serviceRecordPackagerepo;
        $this->damageImagesrepo = $damageImagesrepo;
        $this->inspectionrepo = $inspectionrepo;
        $this->serviceinventoryrepo = $serviceinventoryrepo;
        $this->customerrepo = $customerrepo;
    }

    public function update_damages(Request $request)
    {
        try {
            $request->validate([
                'damage_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'service_no' => 'required|integer',
            ]);

            Log::info('request data', ['image & service_no' => $request->all()]);

            if ($request->hasFile('damage_image')) {
                $file = $request->file('damage_image');
                $path = $file->store('public/damage_reports');
                $image_path = str_replace('public/', 'storage/', $path);
            }

            $service_record = $this->servicerecordrepo->update(['service_no' => $request->service_no, 'image_path' => $image_path], 'damage_marking');

            $this->logrepo->create('Update', 'Service Record', "Service record damages updated successfully ({$request->service_no})");

            return response()->json([
                'service_record' => $service_record
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function update_signature(Request $request)
    {
        try {
            $request->validate([
                'signature' => 'required',
            ]);

            // Convert Base64 file to normal image
            $image = str_replace('data:image/png;base64,', '', $request->signature);
            $image = str_replace(' ', '+', $image);
            $imageData = base64_decode($image);

            // Generate a single filename
            $filename = 'signatures/' . uniqid() . '.png'; // Remove 'storage/' prefix here

            // Save the image to storage/app/public/signatures/
            Storage::disk('public')->put($filename, $imageData);

            // Store the correct path in the database
            $dbFilePath = 'storage/' . $filename; // Prefix 'storage/' here for consistency

            if ($request->type === 'first') {
                $service_record = $this->servicerecordrepo->update([
                    'service_no' => $request->service_no,
                    'data' => ['customer_signature_start' => $dbFilePath]
                ], 'signing');
            } elseif ($request->type === 'second') {
                $service_record = $this->servicerecordrepo->update([
                    'service_no' => $request->service_no,
                    'data' => ['customer_signature_end' => $dbFilePath]
                ], 'signing');
            }

            $this->logrepo->create('Update', 'Service Record', "Service record signature updated successfully ({$request->service_no})");

            return response()->json([
                'service_record' => $service_record
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function search_by_service_record_no(Request $request)
    {
        try {
            $record = $this->servicerecordrepo->search(['service_no'=>$request->record_id]);
            if ($record) {
                return response()->json(["record" => $record], 200);
            } else {
                return response()->json(["message" => "record not found"], 404);
            }
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    public function update_record_status(Request $request, $record_id)
    {
        try {
            $dataRecord = []; // Initialize with default empty array
            $data = [];
            $status = null;
            if ($request->type === '1') {
                $dataRecord = ['status' => 'ONGOING', 'service_no' => $record_id, 'price' => $request->price];
                $data = ['status' => 'ONGOING', 'service_no' => $record_id];
                $status = 'ONGOING';

                $record = $this->servicerecordrepo->search(['service_no'=>$request->record_id]);
                $customer = $this->customerrepo->search($record->customer_id, 'id');
                $customerPhone = $customer->mobile_number;
                $vehicleNumber = $record->vehicle_number;

                $inspections = $this->inspectionrepo->search(['service_no' => $record_id]);

                foreach ($inspections as $inspection) {
                    $inventory = $this->serviceinventoryrepo->findById($inspection->service_inventory_id);

                    if ($inventory) {
                        $oldQty = $inventory->quantity;
                        $newQty = max(0, $oldQty - $inspection->quantity);

                        $inventory->update(['quantity' => $newQty]);
                    }
                }

                $message = "Dear customer, your vehicle ($vehicleNumber) service has now started. You'll be notified once it's completed.";
                
                try {
                    $response = SmsHelper::sendSms($customerPhone, $message);
                    Log::info('SMS', ['response' => $response]);
                    if (is_array($response)) {
                        if (isset($response['status']) && $response['status'] === 'success') {
                            Log::info('SMS sent successfully', ['to' => $customerPhone, 'response' => $response]);
                        } else {
                            Log::warning('SMS sending failed', ['to' => $customerPhone, 'response' => $response]);
                        }
                    } else {
                        Log::error('Unexpected SMS response type', ['response' => $response]);
                    }

                } catch (\Exception $e) {
                    Log::error('SMS sending exception', ['error' => $e->getMessage()]);
                }

            } elseif ($request->type === '2') {
                $dataRecord = ['status' => 'COMPLETED', 'service_no' => $record_id, 'price' => $request->price];
                $data = ['status' => 'COMPLETED', 'service_no' => $record_id];
                $status = 'COMPLETED';

                $record = $this->servicerecordrepo->search(['service_no'=>$request->record_id]);
                $customer = $this->customerrepo->search($record->customer_id, 'id');
                $customerPhone = $customer->mobile_number;
                $vehicleNumber = $record->vehicle_number;

                $message = "Dear customer, your vehicle ($vehicleNumber) service has been completed. Thank you for choosing us!";

                try {
                    $response = SmsHelper::sendSms($customerPhone, $message);
                    Log::info('SMS', ['response' => $response]);
                    if (is_array($response)) {
                        if (isset($response['status']) && $response['status'] === 'success') {
                            Log::info('SMS sent successfully', ['to' => $customerPhone, 'response' => $response]);
                        } else {
                            Log::warning('SMS sending failed', ['to' => $customerPhone, 'response' => $response]);
                        }
                    } else {
                        Log::error('Unexpected SMS response type', ['response' => $response]);
                    }

                } catch (\Exception $e) {
                    Log::error('SMS sending exception', ['error' => $e->getMessage()]);
                }

            }
            $this->servicerecordrepo->update($dataRecord, 'status');
            $this->serviceRecordPackagerepo->update($data, 'status');

            $this->logrepo->create('Update', 'Service Record', "Service record({$record_id}) status updated into ({$status}) successfully");

            return response()->json(["message" => "status updated successfully"], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function get_completed_records(Request $request)
    {
        try {
            $user = Auth::user();
            $type = $request->input('type');

            if ($user->role_id == 1) {
                $service_records = $this->servicerecordrepo->get('', 'completed_admin');
            }
            else if ($user->role_id == 2) {
                $data = ['user_id' => $user->user_id, 'status' => 'COMPLETED'];
                $service_records = $this->servicerecordrepo->get($data, 'completed');

                if ($type === 'today') {
                    $today = Carbon::today()->toDateString();
                    $service_records = collect($service_records)->filter(function ($record) use ($today) {
                        return Carbon::parse($record->date)->toDateString() === $today;
                    })->values();
                }
            }

            return response()->json([
                "message" => "Completed records retrieved successfully",
                "data" => $service_records,
                "user" => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function get_ongoing_records(Request $request)
    {
        try {
            $service_records = $this->servicerecordrepo->get('', 'ongoing');
            $user = Auth::user();
            if ($request->type === 'today') {
                $today = Carbon::today()->toDateString();
                $filteredRecords = collect($service_records)->filter(function ($record) use ($today) {
                    return Carbon::parse($record->date)->toDateString() === $today;
                })->values();
                return response()->json(["message" => "get completed records successfully", 'data' => $filteredRecords, 'user' => $user], 200);
            }
            return response()->json(["message" => "get ongoing records successfully", 'data' => $service_records, 'user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function get_previous_odometer($vehicle_number)
    {
        try {
            $service_record = $this->servicerecordrepo->get($vehicle_number, 'odometer');
            Log::info('odometer', ['odometer' => $service_record]);

            return response()->json(["message" => "get last odometer successfully", 'data' => $service_record], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function get_stats(Request $request)
    {
        try {
            $service_record = $this->servicerecordrepo->get($request, 'stats');
            Log::info('stats', ['stats' => $service_record]);

            return response()->json(["message" => "Get stats successfully", 'data' => $service_record], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function get_all_records()
    {
        try {
            $service_record = $this->servicerecordrepo->get_all();
            return response()->json(["message" => "successfully get all records", 'records' => $service_record], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function create_damages(Request $request)
    {
        try {
            if ($request->hasFile('damage_image')) {
                $file = $request->file('damage_image');
                $path = $file->store('public/damage_images');
                $image_path = str_replace('public/', 'storage/', $path);
            }

            $damage_images = $this->damageImagesrepo->create($request->service_no, $image_path);

            $this->logrepo->create('Create', 'Damages', "Damage Images Created Successfully ({$request->service_no})");

            return response()->json(["message" => "Create Damage Images successfully", 'data' => $damage_images], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
