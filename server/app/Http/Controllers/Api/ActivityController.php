<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ActivityController extends Controller
{
    public function index()
    {
        try {
            // Safer query: avoid potential relationship loading issues by joining
            $rows = Activity::leftJoin('departments', 'departments.id', '=', 'activities.department_id')
                ->select(
                    'activities.id',
                    'activities.item_name',
                    'activities.type',
                    'activities.status',
                    'activities.created_at',
                    'departments.name as department_name'
                )
                ->orderBy('activities.created_at', 'desc')
                ->get();

            // Shape response similar to previous resource with department object
            $data = $rows->map(function ($row) {
                return [
                    'id' => $row->id,
                    'item_name' => $row->item_name,
                    'type' => $row->type,
                    'status' => $row->status,
                    'department' => $row->department_name ? ['name' => $row->department_name] : null,
                    'created_at' => $row->created_at,
                ];
            });

            return response()->json($data);
        } catch (\Throwable $e) {
            Log::error('Failed to load activities', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Failed to load activities'], 500);
        }
    }
}
