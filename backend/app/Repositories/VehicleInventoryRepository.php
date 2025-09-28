<?php
namespace App\Repositories;

use App\Models\VehicleInventory;
use Illuminate\Validation\ValidationException;

class VehicleInventoryRepository {

    protected $VehicleInventory;

    public function __construct(VehicleInventory $vehicleInventory){
        $this->VehicleInventory = $vehicleInventory;
    }

    public function inventoryCreation($request) {
        try {
            $inventories = [];
            foreach ($request->items as $itemData) {
                if ($itemData['no_of_items_in'] > 0) {
                    $inventories[] = $this->VehicleInventory::updateOrCreate(
                        ['service_no' => $request->service_no, 'item' => $itemData['item']],
                        [
                            'no_of_items_in' => $itemData['no_of_items_in'],
                            'no_of_items_out' => 0, 
                        ]
                    );
                }
            }
            return $inventories;

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw $e;
        }
    }
    
    public function inventoryUpdate($request) {
        try {
            foreach ($request->items as $itemData) {
                $inventories[]  = $this->VehicleInventory::updateOrCreate(
                    ['service_no' => $request->service_no, 'item' => $itemData['item']],
                    [
                        'no_of_items_out' => $itemData['no_of_items_out'] ?? 0,
                    ]
                );
            }
            return $inventories;

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw $e;
        }
    }
    
    public function getInventoryByServiceNo($serviceNo) {
        return VehicleInventory::where('service_no', $serviceNo)->get();
    }
    
}
