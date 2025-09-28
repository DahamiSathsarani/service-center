<?php

namespace App\Repositories;

use App\Models\Damage;
use Illuminate\Support\Facades\Auth;

class DamageRepository {
protected $damages;

    public function __construct(Damage $damages)
    {
        $this->damages = $damages;
    }

    public function create($service_no, $image)
    {
        Damage::create([
            'service_no' => $service_no,
            'damage_image' => $image,
        ]);
    }
}
