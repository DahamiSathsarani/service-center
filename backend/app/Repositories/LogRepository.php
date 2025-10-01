<?php

namespace App\Repositories;

use App\Models\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LogRepository {
protected $logs;

    public function __construct(Log $logs)
    {
        $this->logs = $logs;
    }

    public function create($action, $model, $description)
    {
        Log::create([
            'action_type' => $action,
            'model' => $model ?? null,
            'description' => $description,
            'created_at' => now(),
            'updated_at' => now(),
            'user_created' => Auth::id() ?? null,
            'user_updated' => Auth::id() ?? null,
        ]);
    }

    public function get_all()
    {
        return $this->logs->get();
    }

    public function find($id)
    {
        return Log::where('log_id', $id)->first();
    }

    public function delete($id)
    {
        return Log::where('log_id', $id)->delete();
    }

}
