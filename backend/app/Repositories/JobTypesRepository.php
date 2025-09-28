<?php

namespace App\Repositories;

use App\Models\JobType;
use Illuminate\Validation\ValidationException;

class JobTypesRepository {
    protected $job_types;

    public function __construct(JobType $job_types)
    {
        $this->job_types = $job_types;
    }

    public function get()
    {
        return $this->job_types->where('status', 'ACTIVE')->get();
    }
}
