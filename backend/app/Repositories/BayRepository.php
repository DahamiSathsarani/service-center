<?php

/** --------------------------------------------------------------------------------
 * This repository class manages all the data absctration for Bays
 *
 *
 *
 *----------------------------------------------------------------------------------*/

namespace App\Repositories;

use App\Models\Bay;

class BayRepository
{
    protected $bays;

    public function __construct(Bay $bays)
    {
        $this->bays = $bays;
    }
    public function get_bay_details($bay_id)
    {
        return $this->bays::where(['bay_id' => $bay_id])->first();
    }
    public function get_allBay_details($bay_type)
    {
        return $this->bays::where(['bay_type' => $bay_type])->get();
    }
    public function get_bay_details_using_type($bay_type)
    {
        return $this->bays::where(['bay_type' => $bay_type])->get();
    }
    public function update($attribute, $arrayElement)
    {
        return $this->bays::where($attribute['name'], $attribute['value'])->update($arrayElement);
    }
}
