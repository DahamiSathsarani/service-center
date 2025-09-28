<?php

/** --------------------------------------------------------------------------------
 * This repository class manages all the data absctration for service inventories
 *
 *
 *
 *----------------------------------------------------------------------------------*/

namespace App\Repositories;

use App\Models\ServiceInventory;



class ServiceInventoryRepository
{
    protected $service_inventory;

    public function __construct(ServiceInventory $service_inventory)
    {
        $this->service_inventory = $service_inventory;
    }
    public function get_all()
    {
        return $this->service_inventory->all();
    }
    public function search($item)
    {
        return $this->service_inventory->where($item)->get();
    }
    public function create(array $item){
        return $this->service_inventory->create($item);
    }
    public function findById(int $service_inventory_id)
    {
        return $this->service_inventory->findOrFail($service_inventory_id);
    }
    public function update(int $service_inventory_id, array $item)
    {
        $inventory = $this->findById($service_inventory_id);
        $inventory->update($item);
        return $inventory;
    }

    public function delete(int $service_inventory_id)
    {
        $inventory = $this->findById($service_inventory_id);
        return $inventory->delete();
    }
}
