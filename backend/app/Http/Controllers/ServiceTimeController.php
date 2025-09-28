<?php

namespace App\Http\Controllers;

use App\Repositories\BayRepository;
use App\Repositories\ServiceTimeRepository;
use Illuminate\Http\Request;
use App\Repositories\LogRepository;

class ServiceTimeController extends Controller
{
    protected $servicetimerepo;
    protected $bayrepo;
    protected $logrepo;
    public function __construct(ServiceTimeRepository $servicetimerepo, BayRepository $bayrepo, LogRepository $logrepo)
    {
        $this->servicetimerepo = $servicetimerepo;
        $this->bayrepo = $bayrepo;
        $this->logrepo = $logrepo;
    }
    public function getServiceTimeDetails(Request $request)
    {
        $record_id = $request->record_id;
        $all_records = $this->servicetimerepo->get_service_records($record_id);
        if ($all_records) {
            foreach ($all_records as $record) {
                $bay = $this->bayrepo->get_bay_details($record->bay_id);
                $record->__set('bay_type', $bay->bay_type);
            }
            return response()->json(["message" => "records fetch successfully", "all_records" => $all_records, "record_id" => $record_id], 200);
        }
        return response()->json(["message" => "records not found"], 404);
    }
    public function getServiceTimesAccordingToType(Request $request, $bay_type)
    {
        try {
            $selectedBayArray = $this->bayrepo->get_bay_details_using_type($bay_type);
            foreach ($selectedBayArray as $bay) {
                $record =   $this->servicetimerepo->get_service_records_related_to_type($request->record_id, $bay->bay_id)->first();
                if ($record) {
                    return response()->json(["message" => "record fetch successfully", "record" => $record], 200);
                }
            }
            return response()->json(["message" => "records not found"], 404);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    public function create_service_record(Request $request, $bay_type)
    {
        try {
            $selectedBayArray = $this->bayrepo->get_bay_details_using_type($bay_type);
            foreach ($selectedBayArray as $bay) {
                $record =   $this->servicetimerepo->get_service_records_related_to_type($request->service_no, $bay->bay_id)->first();
                if ($record) {
                    return response()->json(["message" => "A record found"], 500);
                }
            }
            $record_data = [
                'service_no' => $request->service_no,
                'bay_id' => $request->bay_id,
                'status' => 'ONGOING',
                'in_time' => $request->in_time,
                'out_time' => null
            ];
            $this->servicetimerepo->create($record_data);
            $this->bayrepo->update(['name' => 'bay_id', 'value' => $request->bay_id], ['is_busy' => 1]);

            $this->logrepo->create('Create', 'Service Time', "Service record({$request->service_no}) vehicle is in ({$request->bay_id}) Bay");
            return response()->json(["message" => "Record Created Successfully"], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function update_service_record(Request $request, $bay_type)
    {
        try {
            $selectedBayArray = $this->bayrepo->get_bay_details_using_type($bay_type);
            foreach ($selectedBayArray as $bay) {
                $record =   $this->servicetimerepo->get_service_records_related_to_type($request->service_no, $bay->bay_id)->first();
                if ($record) {
                    $this->servicetimerepo->update(['name' => 'id', 'value' => $record->id], ['status' => 'COMPLETED', 'out_time' => $request->out_time]);
                    $this->bayrepo->update(['name' => 'bay_id', 'value' => $record->bay_id], ['is_busy' => 0]);

                    $this->logrepo->create('Update', 'Service Time', "Service record({$request->service_no}) vehicle is out from ({$record->bay_id}) Bay");
                    return response()->json(["message" => "Record Updated Successfully"], 200);
                }
            }

            return response()->json(["message" => "Record not found"], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
