<?php

namespace App\Http\Controllers;

use App\Repositories\BayRepository;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\Return_;

class BayController extends Controller
{
    protected $bayrepo;
    public function __construct(BayRepository $bayrepo)
    {
        $this->bayrepo = $bayrepo;
    }
    public function get_all_bay_details($bay_type)
    {
        try {
            $all_bays = $this->bayrepo->get_allBay_details($bay_type);
            if ($all_bays) {
                return response()->json(['message' => "Lube data retrieve successfully", 'all_bays' => $all_bays]);
            }
            return response()->json(['message' => 'not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
