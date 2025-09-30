<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::with('department', 'folder')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($activities);
    }
}
