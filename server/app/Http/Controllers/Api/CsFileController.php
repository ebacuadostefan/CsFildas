<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CsFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CsFileController extends Controller
{
    // List files in a folder
    public function index($folderId)
    {
        return CsFile::where('folder_id', $folderId)->get();
    }

    // Upload file
    public function store(Request $request, $folderId)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480' // max 20MB
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public'); // stored in storage/app/public/uploads

        $newFile = CsFile::create([
            'folder_id' => $folderId,
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
        $file = CsFile::findOrFail($id);

        // delete file from storage
        $path = str_replace("/storage/", "", $file->filePath);
        Storage::disk('public')->delete($path);

        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }
}
