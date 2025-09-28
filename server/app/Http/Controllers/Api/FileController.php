<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    // List files in a folder
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
            'file' => 'required|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480' // max 20MB
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public'); // stored in storage/app/public/uploads

        $newFile = File::create([
            'folder_id' => $folderId,
            'fileName' => $file->getClientOriginalName(),
            'filePath' => "/storage/" . $path,
            'fileType' => $file->getClientMimeType(),
            'fileSize' => $file->getSize(),
        ]);

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
        $path = $file->store('uploads', 'public'); // stored in storage/app/public/uploads

        $newFile = File::create([
            'folder_id' => $folder->id,
            'fileName' => $file->getClientOriginalName(),
            'filePath' => "/storage/" . $path,
            'fileType' => $file->getClientMimeType(),
            'fileSize' => $file->getSize(),
        ]);

        return response()->json($newFile, 201);
    }

    // Delete file
    public function destroy($id)
    {
        $file = File::findOrFail($id);

        // delete file from storage
        $path = str_replace("/storage/", "", $file->filePath);
        Storage::disk('public')->delete($path);

        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }

    // Delete file by slug
    public function destroyBySlug($slug, $fileId)
    {
        $folder = Folder::where('slug', $slug)->firstOrFail();
        $file = File::where('id', $fileId)->where('folder_id', $folder->id)->firstOrFail();

        // delete file from storage
        $path = str_replace("/storage/", "", $file->filePath);
        Storage::disk('public')->delete($path);

        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }
}
