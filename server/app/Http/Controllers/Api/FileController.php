<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Activity;

class FileController extends Controller
{
    // List files in a folder
    // Note: When using soft deletes, this query automatically excludes archived files.
    public function index($folderId)
    {
        return File::where('folder_id', $folderId)->get();
    }

    // List files in a folder by slug
    public function indexBySlug($slug)
    {
        $folder = Folder::where('slug', $slug)->firstOrFail();
        return File::where('folder_id', $folder->id)->get();
    }

    // Upload file
    public function store(Request $request, $folderId)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480' // max 20MB
        ]);

        $folder = Folder::findOrFail($folderId); 
        $file = $request->file('file');
        $path = $file->store('uploads', 'public');

        $newFile = File::create([
            'folder_id' => $folderId,
            'fileName' => $file->getClientOriginalName(),
            'filePath' => "/storage/" . $path,
            'fileType' => $file->getClientMimeType(),
            'fileSize' => $file->getSize(),
        ]);

        // LOGGING: File Added
        if (class_exists('App\Models\Activity')) {
            Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $newFile->fileName,
                'type'          => 'file',
                'status'        => 'added',
            ]);
        }

        return response()->json($newFile, 201);
    }

    // Upload file by slug
    public function storeBySlug(Request $request, $slug)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480' // max 20MB
        ]);

        $folder = Folder::where('slug', $slug)->firstOrFail();
        $file = $request->file('file');
        $path = $file->store('uploads', 'public');

        $newFile = File::create([
            'folder_id' => $folder->id,
            'fileName' => $file->getClientOriginalName(),
            'filePath' => "/storage/" . $path,
            'fileType' => $file->getClientMimeType(),
            'fileSize' => $file->getSize(),
        ]);

        // LOGGING: File Added
        if (class_exists('App\Models\Activity')) {
            Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $newFile->fileName,
                'type'          => 'file',
                'status'        => 'added',
            ]);
        }

        return response()->json($newFile, 201);
    }

    // Delete file (Archives the file)
    public function destroy($id)
    {
        $file = File::findOrFail($id);
        $folder = $file->folder; 

        // CRITICAL CHANGE: Removed Storage::disk('public')->delete($path);
        // The file must remain in storage for restoration from the archive.

        // Perform soft delete (moves to archive)
        $file->delete();

        // LOGGING: File Deleted (Archived)
        if (class_exists('App\Models\Activity') && $folder) {
            Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $file->fileName,
                'type'          => 'file',
                'status'        => 'deleted', // Status remains 'deleted' to signal archiving
            ]);
        }

        return response()->json(['message' => 'File archived successfully']);
    }

    // Delete file by slug (Archives the file)
    public function destroyBySlug($slug, $fileId)
    {
        $folder = Folder::where('slug', $slug)->firstOrFail();
        // Use firstOrFail() on the combined query to ensure the file belongs to the folder
        $file = File::where('id', $fileId)->where('folder_id', $folder->id)->firstOrFail();

        // CRITICAL CHANGE: Removed Storage::disk('public')->delete($path);
        // The file must remain in storage for restoration from the archive.

        // Perform soft delete (moves to archive)
        $file->delete();

        // LOGGING: File Deleted (Archived)
        if (class_exists('App\Models\Activity')) {
            Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $file->fileName,
                'type'          => 'file',
                'status'        => 'deleted', // Status remains 'deleted' to signal archiving
            ]);
        }

        return response()->json(['message' => 'File archived successfully']);
    }

    // Rename file by id
    public function rename(Request $request, $id)
    {
        $validated = $request->validate([
            'fileName' => 'required|string|max:255',
        ]);

        $file = File::findOrFail($id);
        $file->fileName = $validated['fileName'];
        $file->save();

        // LOGGING: File Renamed
        if (class_exists('App\Models\Activity')) {
            Activity::create([
                'department_id' => $file->folder->department_id, 
                'folder_id'     => $file->folder_id,
                'item_name'     => $file->fileName, // Log the new name
                'type'          => 'file',
                'status'        => 'renamed',
            ]);
        }

        return response()->json($file, 200);
    }

    // Rename file by slug and fileId
    public function renameBySlug(Request $request, $slug, $fileId)
    {
        $validated = $request->validate([
            'fileName' => 'required|string|max:255',
        ]);

        $folder = Folder::where('slug', $slug)->firstOrFail();
        $file = File::where('id', $fileId)->where('folder_id', $folder->id)->firstOrFail();
        $file->fileName = $validated['fileName'];
        $file->save();

        // LOGGING: File Renamed
        if (class_exists('App\Models\Activity')) {
            Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $file->fileName, // Log the new name
                'type'          => 'file',
                'status'        => 'renamed',
            ]);
        }

        return response()->json($file, 200);
    }
}
