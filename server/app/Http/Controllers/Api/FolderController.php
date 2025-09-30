<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\Department;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FolderController extends Controller
{
    /**
     * Get all folders (paginated for performance).
     */
    public function index()
    {
        return response()->json(Folder::paginate(15), 200);
    }

    /**
     * Store new folder within a specific department.
     */
    public function store(Request $request, $departmentSlug)
    {
        try {
            // 1. Find the Department using the slug from the URL
            $department = Department::where('slug', $departmentSlug)->firstOrFail();

            // 2. Validate folder data from the request body
            $validated = $request->validate([
                'folderName'    => 'required|string|max:255',
                'description'   => 'nullable|string',
            ]);

            // 3. Add the required department_id to the validated data
            $validated['department_id'] = $department->id;

            // --- SLUG GENERATION LOGIC ---
            $baseSlug = Str::slug($validated['folderName']);
            if ($baseSlug === '') {
                $baseSlug = 'folder-' . time();
            }
            $slug = $baseSlug;
            $counter = 1;

            // Ensure the slug is unique, checking active AND soft-deleted items
            while (Folder::withTrashed()
                        ->where('department_id', $validated['department_id'])
                        ->where('slug', $slug)
                        ->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $validated['slug'] = $slug;
            // -----------------------------

            $folder = Folder::create($validated);

            // Log Activity: folder added
            if (class_exists(\App\Models\Activity::class)) {
                \App\Models\Activity::create([
                    'department_id' => $department->id,
                    'folder_id'     => $folder->id,
                    'item_name'     => $folder->folderName,
                    'type'          => 'folder',
                    'status'        => 'added',
                ]);
            }

            return response()->json($folder, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to create folder',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show single folder by ID.
     */
    public function show($id)
    {
        $folder = Folder::findOrFail($id);
        return response()->json($folder, 200);
    }

    /**
     * Show folder by slug.
     */
    public function showBySlug($slug)
    {
        $folder = Folder::where('slug', $slug)->firstOrFail();
        return response()->json($folder, 200);
    }

    /**
     * Update folder.
     */
    public function update(Request $request, $id)
    {
        $folder = Folder::findOrFail($id);

        $validated = $request->validate([
            'folderName' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $folder->update($validated);

        // Optional: Activity log
        if (class_exists(\App\Models\Activity::class)) {
            \App\Models\Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $folder->folderName,
                'type'          => 'folder',
                'status'        => 'renamed',
            ]);
        }

        return response()->json($folder, 200);
    } 

    /**
     * Delete folder (Soft Deletes).
     */
    public function destroy($id)
    {
        $folder = Folder::findOrFail($id);

        $folderId = $folder->id;
        $departmentId = $folder->department_id;
        $itemName = $folder->folderName;

        // Also soft-delete all files under this folder so they appear in Archive
        File::where('folder_id', $folderId)->get()->each(function ($file) {
            if (method_exists($file, 'delete')) {
                $file->delete();
            }
        });

        $folder->delete(); // Uses the SoftDeletes trait

        // Optional: Activity log
        if (class_exists(\App\Models\Activity::class)) {
            \App\Models\Activity::create([
                'department_id' => $departmentId,
                'folder_id'     => $folderId,
                'item_name'     => $itemName,
                'type'          => 'folder',
                'status'        => 'deleted',
            ]);
        }

        return response()->json(null, 204);
    }
}
