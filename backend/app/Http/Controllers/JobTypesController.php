<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\JobTypesRepository;

class JobTypesController extends Controller
{
    protected $jobtyperepo;

    public function __construct(JobTypesRepository $jobtyperepo)
    {
        $this->jobtyperepo = $jobtyperepo;
    }
    
    public function getAllJobTypes()
    {
        try {
            $job_types = $this->jobtyperepo->get();

            if ($job_types->isEmpty()) {
                return response()->json(['message' => 'No job types found'], 404);
            }

            return response()->json([
                'job_types' => $job_types
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

}
