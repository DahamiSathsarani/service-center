<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\PackagePriceRepository;
use Illuminate\Support\Facades\Log;

class PackagePriceController extends Controller
{
    protected $packagepricerepo;
    public function __construct(PackagePriceRepository $packagepricerepo)
    {
        $this->packagepricerepo = $packagepricerepo;
    }

    public function getSubJobTypes()
    {
        try {
            $subJobTypes= $this->packagepricerepo->getJobNames();
            Log::info('Retrieved subJobTypes:', ['data' => $subJobTypes]);
            
            if ($subJobTypes) {
                return response()->json([
                    'sub_job_types' => $subJobTypes
                ], 200);
            }else{
                return response()->json(['message' => 'Sub jobs not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message', $e->getMessage()], 500);
        }
    }
}
