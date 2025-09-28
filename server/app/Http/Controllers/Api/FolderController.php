<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    // Get all folders
    public function index()
    {
        return response()->json(Folder::all(), 200);
    }

    // Store new folder
    public function store(Request $request)
    {
        $validated = $request->validate([
            'folderName' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $folder = Folder::create($validated);

        return response()->json($folder, 201);
    }

    // Show single folder
    public function show($id)
    {
        $folder = Folder::findOrFail($id);
        return response()->json($folder, 200);
    }

    // Show folder by slug
    public function showBySlug($slug)
    {
        $folder = Folder::where('slug', $slug)->firstOrFail();
        return response()->json($folder, 200);
    }

    // Update folder
    public function update(Request $request, $id)
    {
        $folder = Folder::findOrFail($id);

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
        $folder = Folder::findOrFail($id);
        $folder->delete();

        return response()->json(null, 204);
    }
}
