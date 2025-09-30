<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use App\Models\Folder;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class DepartmentController extends Controller
{
    // GET /api/departments
    public function index(Request $request)
    {
        $query = Department::query();
        
        // --- UPDATED SEARCH LOGIC (DEPARTMENT) ---
        if ($request->has('q')) {
            $searchTerm = $request->query('q');
            
            // Apply grouped OR conditions to search across name, alias, and slug
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('alias', 'like', '%' . $searchTerm . '%')
                  ->orWhere('slug', 'like', '%' . $searchTerm . '%');
            });
        }
        // --- END UPDATED SEARCH LOGIC ---
        
        $departments = $query->get();

        // Transform image into full URL
        $departments->transform(function ($dept) {
            if ($dept->image) {
                $dept->image = asset('storage/' . $dept->image);
            }
            return $dept;
        });

        return response()->json($departments);
    }

    // POST /api/departments
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,svg|max:5120',
            'name'  => 'required|string|max:255|unique:departments,name',
            'alias' => 'required|string|max:55',
        ]);

        if ($request->hasFile('image')) {
            $filename = time() . '_' . Str::slug(pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME));
            $extension = $request->file('image')->getClientOriginalExtension();
            $path = $request->file('image')->storeAs('department_images', $filename . '.' . $extension, 'public');
            $validated['image'] = $path;
        }

        $department = Department::create($validated);

        // Automatically create a folder for the department
        // FIX: Using 'folderName' to match Folder Model's $fillable array
        Folder::create([
            'folderName'    => $department->name, 
            'description'   => "Main folder for {$department->name} department",
            'department_id' => $department->id,
            'slug'          => $department->slug,
        ]);

        // Add full URL to image before returning
        if ($department->image) {
            $department->image = asset('storage/' . $department->image);
        }

        return response()->json($department, 201);
    }

    // PUT /api/departments/{id}
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'required|string|max:255|unique:departments,name,' . $id,
            'alias' => 'required|string|max:55',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:20480', // max 20MB
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($department->image && Storage::disk('public')->exists($department->image)) {
                Storage::disk('public')->delete($department->image);
            }

            $filename = time() . '_' . Str::slug(pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME));
            $extension = $request->file('image')->getClientOriginalExtension();
            $path = $request->file('image')->storeAs('department_images', $filename . '.' . $extension, 'public');

            $validated['image'] = $path;
        } else {
            $validated['image'] = $department->image;
        }

        $department->update($validated);

        if ($department->image) {
            $department->image = asset('storage/' . $department->image);
        }

        return response()->json($department);
    }

    // DELETE /api/departments/{id}
    public function destroy($id)
    {
        $department = Department::findOrFail($id);

        if ($department->image && Storage::disk('public')->exists($department->image)) {
            Storage::disk('public')->delete($department->image);
        }

        $department->delete();

        return response()->json(null, 204);
    }

    // GET folders for a department by slug
    public function getFolders($slug, Request $request)
    {
        $department = Department::where('slug', $slug)->firstOrFail();
        $folderQuery = Folder::where('department_id', $department->id);
        
        // --- UPDATED FOLDER SEARCH LOGIC ---
        if ($request->has('q')) {
            $searchTerm = $request->query('q');
            
            // Apply grouped OR conditions to search across folderName, description, and slug
            // Using 'folderName' to match Model accessor/fillable name
            $folderQuery->where(function ($q) use ($searchTerm) { 
                $q->where('folderName', 'like', '%' . $searchTerm . '%') 
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('slug', 'like', '%' . $searchTerm . '%');
            });
        }
        // --- END UPDATED FOLDER SEARCH LOGIC ---

        $folders = $folderQuery->get();

        return response()->json($folders->map(function ($folder) {
            return [
                'id'            => $folder->id,
                'folderName'    => $folder->folderName,
                'description'   => $folder->description,
                'slug'          => $folder->slug,
                'departmentId'  => $folder->department_id,
            ];
        }));
    }

    // POST create folder inside a department
    public function createFolder($slug, Request $request)
    {
        // Validate request first
        $validated = $request->validate([
            'folderName' => 'required|string|max:255',
            'description'=> 'nullable|string',
        ]);

        // Find the department by slug
        $department = Department::where('slug', $slug)->firstOrFail();

        // --- UNIQUE SLUG GENERATION LOGIC ---
        $baseSlug = Str::slug($validated['folderName']);
        $folderSlug = $baseSlug;
        $counter = 1;

        // Ensure the slug is unique within this department
        // We use 'slug' for the lookup, which is fine since it's in $fillable
        while (Folder::where('department_id', $department->id)
                      ->where('slug', $folderSlug)
                      ->exists()) {
            $folderSlug = $baseSlug . '-' . $counter++;
        }
        // --- END UNIQUE SLUG GENERATION LOGIC ---

        // Create the folder
        // FIX: Using camelCase key 'folderName' to match Folder Model's $fillable array
        $folder = Folder::create([
            'folderName'    => $validated['folderName'], 
            'description'   => $validated['description'] ?? null,
            'department_id' => $department->id,
            'slug'          => $folderSlug, 
        ]);

        // Optional: log activity (if you have Activity model)
        if (class_exists('App\Models\Activity')) {
            \App\Models\Activity::create([
                'department_id' => $department->id,
                'folder_id'     => $folder->id,
                'item_name'     => $folder->folderName,
                'type'          => 'folder',
                'status'        => 'added',
            ]);
        }

        // Return the new folder
        return response()->json([
            'id'            => $folder->id,
            'folderName'    => $folder->folderName,
            'description'   => $folder->description,
            'slug'          => $folder->slug,
            'departmentId'  => $folder->department_id,
        ], 201);
    }

}
