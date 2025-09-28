<?php

/** --------------------------------------------------------------------------------
 * This repository class manages all the data absctration for vehicle handovers
 *
 *
 *
 *----------------------------------------------------------------------------------*/

namespace App\Repositories;

use App\Models\VehicleHandover;

class VehicleHandoverRepository
{
    protected $vehicle_handovers;

    public function __construct(VehicleHandover $vehicleHandover)
    {
        $this->vehicle_handovers = $vehicleHandover;
    }
    public function create($data)
    {
        $this->vehicle_handovers->create($data);
    }
    public function search($data)
    {
       return $this->vehicle_handovers->where($data)->get();
    }
}
