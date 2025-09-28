<?php

/** --------------------------------------------------------------------------------
 * This repository class manages all the data absctration for customers
 *
 *
 *
 *----------------------------------------------------------------------------------*/

namespace App\Repositories;

use App\Models\Customer;
use Illuminate\Validation\ValidationException;

class CustomerRepository
{
    protected $customers;

    public function __construct(Customer $customers)
    {
        $this->customers = $customers;
    }
    public function create($data)
    {
        return $this->customers::create($data);
    }
    public function search($value, $type)
    {
        if ($type == 'phone_number') {
            return $this->customers::where(['mobile_number' => $value, 'status' => 'ACTIVE'])->first();
        } elseif ($type == 'id') {
            return $this->customers::where(['customer_id' => $value, 'status' => 'ACTIVE'])->first();
        }
    }
    public function get_all()
    {
        return $this->customers->get();
    }
    public function update($condition, $data)
    {
        return $this->customers->where($condition)->update($data);
    }
}
