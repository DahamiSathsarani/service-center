<?php

namespace App\Http\Controllers;

use App\Repositories\VehicleHandoverRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VehicleHandoverController extends Controller
{
    protected $vehiclehandoverrepo;

    public function __construct(VehicleHandoverRepository $vehicleHandoverrepo)
    {
        $this->vehiclehandoverrepo = $vehicleHandoverrepo;
    }
    public function create_handover_records(Request $request)
    {
        try {
            // Validate Base64 format
            if (!preg_match('/^data:image\/(png|jpeg|jpg);base64,/', $request->signature)) {
                return response()->json(['message' => 'Invalid image format'], 400);
            }

            // Clean up Base64 string
            $image = preg_replace('/^data:image\/\w+;base64,/', '', $request->signature);
            $image = str_replace(' ', '+', $image);
            $imageData = base64_decode($image);

            if (!$imageData) {
                return response()->json(['message' => 'Invalid base64 encoding'], 400);
            }

            // Generate a unique filename
            $filename = 'signatures/' . uniqid() . '.png';

            // Save image in public storage
            Storage::disk('public')->put($filename, $imageData);

            // Correct file path for database storage
            $dbFilePath = 'storage/' . $filename;

            // Prepare data
            $data = [
                'service_no' => $request->service_no,
                'checking_item' => $request->type,
                'signature' => $dbFilePath,
                'time' => $request->time
            ];

            if ($request->type === 'wheels_inspect') {
                $data['name'] = $request->input('data.inspect.selectedWheelsInspector', null);
            } elseif ($request->type === 'final_finishing') {
                $data['name'] = $request->input('data.inspect.selectedFinalChecker', null);
            }

            // Save to database
            $this->vehiclehandoverrepo->create($data);

            return response()->json(['message' => 'Record added successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function get_hondover_records($record_id)
    {
        try {
            $record = $this->vehiclehandoverrepo->search(['service_no' => $record_id]);
            if ($record) {
                return response()->json(['message' => 'record add successfully', 'record' => $record], 200);
            }
            return response()->json(['message' => 'record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
