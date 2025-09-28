<?php

namespace App\Repositories;

use App\Models\OldCustomer;
use Illuminate\Validation\ValidationException;

class OldCustomerRepository {
    protected $oldCustomer;

    public function __construct(OldCustomer $oldCustomer)
    {
        $this->oldCustomer = $oldCustomer;
    }

    public function create($vehicle_number, $customer_id)
    {
        try {
            $old_customer = OldCustomer::create([
                'vehicle_number' => $vehicle_number,
                'customer_id' => $customer_id,
            ]);

            return $old_customer;
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function search($value, $type)
    {
        if ($type == 'vehicle_number') {
            return $this->oldCustomer::where(['vehicle_number' => $value])->with('customer')->get();
        } elseif ($type == 'customer_id') {
            return $this->oldCustomer::where(['customer_id' => $value])->with('vehicle')->get();
        }
    }

}
