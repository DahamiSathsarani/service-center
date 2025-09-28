<?php

/** --------------------------------------------------------------------------------
 * This repository class manages all the data absctration for service times
 *
 *
 *
 *----------------------------------------------------------------------------------*/

namespace App\Repositories;

use App\Models\ServiceTime;



class ServiceTimeRepository
{
    protected $service_times;

    public function __construct(ServiceTime $service_times)
    {
        $this->service_times = $service_times;
    }
    public function get_service_records($record_id)
    {
        return $this->service_times->where(['service_no' => $record_id])->get();
    }
    public function get_service_records_related_to_type($record_id, $bay_id)
    {
        return $this->service_times->where(['service_no' => $record_id, 'bay_id' => $bay_id])->get();
    }
    public function create($data)
    {
        $this->service_times::create($data);
    }
    public function update($attribute, $arrayElement)
    {
        return $this->service_times::where($attribute['name'], $attribute['value'])->update($arrayElement);
    }

}
