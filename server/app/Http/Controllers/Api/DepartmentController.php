<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // List all departments
    public function index()
    {
        return response()->json(Department::all());
    }

    // Optional: Add new department
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:departments,name']);

        $department = Department::create(['name' => $request->name]);

        return response()->json($department, 201);
    }
}
