<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // GET /api/departments
    public function index()
    {
        return response()->json(Department::all());
    }

    // POST /api/departments
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'alias' => 'required|string|max:55',
        ]);

        $department = Department::create($validated);

        return response()->json($department, 201);
    }

    // PUT /api/departments/{id}
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $id,
            'alias' => 'required|string|max:55',
        ]);

        $department->update($validated);

        return response()->json($department);
    }

    // DELETE /api/departments/{id}
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json(null, 204);
    }
}

