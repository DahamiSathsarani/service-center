<?php

/** --------------------------------------------------------------------------------
 * This repository class manages all the data absctration for inspections
 *
 *
 *
 *----------------------------------------------------------------------------------*/

namespace App\Repositories;

use App\Models\Inspection;



class InspectionRepository
{
    protected $inspections;

    public function __construct(Inspection $inspection)
    {
        $this->inspections = $inspection;
    }
    public function create($items)
    {
        $this->inspections->create($items);
    }
    public function search($item)
    {
        return  $this->inspections->where($item)->get();
    }
}
