<?php

namespace App\Http\Controllers;

use App\Repositories\InspectionRepository;
use App\Repositories\ServiceInventoryRepository;
use Illuminate\Http\Request;
use App\Repositories\LogRepository;

class InspectionController extends Controller
{
    protected $inspectionrepo;
    protected $serviceinventoryrepo;
    protected $logrepo;

    public function __construct(InspectionRepository $inspectionrepo, ServiceInventoryRepository $serviceinventoryrepo, LogRepository $logrepo)
    {
        $this->inspectionrepo = $inspectionrepo;
        $this->serviceinventoryrepo = $serviceinventoryrepo;
        $this->logrepo = $logrepo;
    }
    public function create_and_update_inspections(Request $request)
    {
        $items = $request->inspections;
        $other_items = $request->others;
        $type = $request->input('type');
        try {
            if ($items) {
                foreach ($items as $item) {
                    if ($item['item_name'] !== null && $item['rmk'] !== null && $item['item_code'] !== null && $item['quantity'] !== null) {
                        $record = $this->serviceinventoryrepo->search(["item_name" => $item['item_name'], "item_code" =>  $item['item_code']])->first();
                        if ($record) {
                            $recordArray = $this->serviceinventoryrepo->search(["item_name" => $item['item_name']]);
                            $inspection_by_service_no = $this->inspectionrepo->search(['service_no' => $request->record_id]);
                            if ($inspection_by_service_no) {
                                foreach ($inspection_by_service_no as $unit) {
                                    foreach ($recordArray as $recordUnit) {
                                        if ($unit->service_inventory_id === $recordUnit->service_inventory_id) {
                                            $unit->delete();
                                        }
                                    }
                                }
                            }
                            $data = ["quantity" =>  $item['quantity'], "remark" => $item['rmk'], "service_no" => $request->record_id, "service_inventory_id" => $record->service_inventory_id];
                            $this->inspectionrepo->create($data);
                            $this->logrepo->create('Create', 'Inspection', "({$item['quantity']}) number of Service Inventory({$record->service_inventory_id}) are added({$item['rmk']}) to Service No: ({$request->record_id})");

                            if ($type === 'bay_inspection') {
                                $newQty = max(0, $record->quantity - $item['quantity']);
                                $record->quantity = $newQty;
                                $record->save();

                                $this->logrepo->create(
                                    'Update',
                                    'ServiceInventory',
                                    "Reduced ({$item['quantity']}) from inventory ID: {$record->service_inventory_id}. New quantity: {$newQty}"
                                );
                            }
                        }
                    }
                }
            }
            if ($other_items && $other_items['other_quantity'] && $other_items['other_rmk'] && $other_items['other_comment'] && $other_items['other_item_name'] && $other_items['other_price']) {
                $result =  $this->inspectionrepo->search(['service_no' => $request->record_id, 'service_inventory_id' => 92])->first();
                if ($result) {
                    $result->delete();
                }
                $data = ["quantity" =>  $other_items['other_quantity'], "remark" => $other_items['other_rmk'], "service_no" => $request->record_id, "service_inventory_id" => 92, "comment" => $other_items['other_comment'], 'item' => $other_items['other_item_name'], 'price' => $other_items['other_price']];
                $this->inspectionrepo->create($data);
                $this->logrepo->create('Create', 'Inspection', "({$other_items['other_quantity']}) number of Other Service Inventory({$other_items['other_item_name']}) are added({$other_items['rmk']}) to Service No: ({$request->record_id})");
            }

            return response()->json(['message' => "record updated successfully"], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function get_inspection_items(Request $request)
    {
        try {
            $items = $this->inspectionrepo->search(['service_no' => $request->service_no]);
            return response()->json(["inspection_items" => $items], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
