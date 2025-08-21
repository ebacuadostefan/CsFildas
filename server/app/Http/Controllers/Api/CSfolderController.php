<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CSfolder;
use Illuminate\Http\Request;

class CSfolderController extends Controller
{
    // Get all folders
    public function index()
    {
        return response()->json(CSfolder::all(), 200);
    }

    // Store new folder
    public function store(Request $request)
    {
        $validated = $request->validate([
            'folderName' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $folder = CSfolder::create($validated);

        return response()->json($folder, 201);
    }

    // Show single folder
    public function show($id)
    {
        $folder = CSfolder::findOrFail($id);
        return response()->json($folder, 200);
    }

    // Update folder
    public function update(Request $request, $id)
    {
        $folder = CSfolder::findOrFail($id);

        $validated = $request->validate([
            'folderName' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $folder->update($validated);

        return response()->json($folder, 200);
    }

    // Delete folder
    public function destroy($id)
    {
        $folder = CSfolder::findOrFail($id);
        $folder->delete();

        return response()->json(null, 204);
    }
}
