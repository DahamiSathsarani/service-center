<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\LogRepository;

class LogController extends Controller
{
    protected $logrepo;

    public function __construct(LogRepository $logrepo)
    {
        $this->logrepo = $logrepo;
    }

    public function get_all_logs()
    {
        try {
            $logs = $this->logrepo->get_all();
            if ($logs) {
                return response()->json([
                    'logs' => $logs
                ], 200);
            }
            return response()->json([
                'message' => "record not found"
            ], 404);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function delete_log($id)
    {
        try {
            $log = $this->logrepo->find($id);

            if (!$log) {
                return response()->json(["message" => "Log not found"], 404);
            }

            $this->logrepo->delete($id);

            return response()->json(["message" => "Log deleted successfully"], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

}
