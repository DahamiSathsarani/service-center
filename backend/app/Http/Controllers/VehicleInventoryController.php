<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Repositories\VehicleInventoryRepository;
use App\Repositories\LogRepository;
use Illuminate\Support\Facades\Log;

class VehicleInventoryController extends Controller {
    protected $inventoryRepo;
    protected $logrepo;

    public function __construct(VehicleInventoryRepository $inventoryRepo, LogRepository $logrepo) {
        $this->inventoryRepo = $inventoryRepo;
        $this->logrepo = $logrepo;
    }

    public function inventoryCreation(Request $request){
        try {
            $request->validate([
                'items' => 'required|array',
                'service_no' => 'required|numeric',
            ]);

            $inventory = $this->inventoryRepo->inventoryCreation(request: $request);
            Log::info('inventory', ['inventory' => json_encode($inventory)]);

            foreach ($inventory as $inventory_item) {
                $this->logrepo->create('Create', 'Vehicle Inventory', "{$inventory_item->no_of_items_in} number of {$inventory_item->item}(s) are added in the {$inventory_item->service_no}th service before the service.");
            }
    
            if ($inventory) {
                return response()->json([
                    'inventory' => $inventory
                ], 200);
            }else{
                return response()->json(['message' => 'Inventory not found'], 404);
            }
            
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function inventoryUpdate(Request $request){
        try {
            $request->validate([
                'items' => 'required|array',
                'service_no' => 'required|numeric',
            ]);

            $inventory = $this->inventoryRepo->inventoryUpdate(request: $request);

            
            foreach ($inventory as $inventory_item) {
                $this->logrepo->create('Update', 'Vehicle Inventory', "{$inventory_item->no_of_items_in} number of {$inventory_item->item}(s) are added in the {$inventory_item->service_no}th service after the service.");
            }
    
            if ($inventory) {
                return response()->json([
                    'inventory' => $inventory
                ], 200);
            }else{
                return response()->json(['message' => 'Inventory not found'], 404);
            }
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getInventoryByServiceNo($serviceNo) {

        try {
            $inventory = $this->inventoryRepo->getInventoryByServiceNo($serviceNo);

            if ($inventory) {
                return response()->json([
                    'inventory' => $inventory
                ], 200);
            }else{
                return response()->json(['message' => 'Inventory not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message', $e->getMessage()], 500);
        }
    }
}
