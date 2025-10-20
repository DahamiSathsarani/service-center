<?php

namespace App\Http\Controllers;

use App\Repositories\ServiceInventoryRepository;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ServiceInventoryController extends Controller
{
    protected $serviceinventoryrepo;
    public function __construct(ServiceInventoryRepository $serviceinventoryrepo)
    {
        $this->serviceinventoryrepo = $serviceinventoryrepo;
    }
    public function get_all_inventories()
    {
        try {
            $service_inventries = $this->serviceinventoryrepo->get_all();
            if ($service_inventries) {
                return response()->json(["message" => "records founds", "inventries" => $service_inventries], 200);
            }
            return response()->json(["message" => "record not found"], 404);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    public function search_inventry($item_name, $item_code)
    {
        try {
            return $this->serviceinventoryrepo->search(["item_name" => $item_name, "item_code" => $item_code]);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    public function store(Request $request)
    {
        try {
            $inventory = $this->serviceinventoryrepo->create($request->all());
            return response()->json(['inventory' => $inventory, 'message' => 'Inventory item created successfully'], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($service_inventory_id)
    {
        try {
            $inventory = $this->serviceinventoryrepo->findById($service_inventory_id);
            return response()->json(['inventory' => $inventory], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Inventory item not found'], 404);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $service_inventory_id)
    {
        try {
            $request->validate([
                'name' => 'string',
                'type' => 'string',
                'quantity' => 'integer|min:0',
                'price' => 'numeric|min:0',
            ]);
            $inventory = $this->serviceinventoryrepo->update($service_inventory_id, $request->all());
            return response()->json(['inventory' => $inventory, 'message' => 'Inventory item updated successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Inventory item not found'], 404);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy($service_inventory_id)
    {
        try {
            $this->serviceinventoryrepo->delete($service_inventory_id);
            return response()->json(['message' => 'Inventory item deleted successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Inventory item not found'], 404);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
