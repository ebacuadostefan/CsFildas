<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Folder;
use Illuminate\Support\Facades\DB;
use App\Models\Activity;

class ArchiveController extends Controller
{
    /**
     * List all soft-deleted (archived) files and folders.
     */
    public function index()
    {
        // Fetch only soft-deleted files and eager load their parent folder
        $archivedFiles = File::onlyTrashed()
            ->with('folder.department') 
            ->get(['id', 'folder_id', 'fileName', 'fileType', 'fileSize', 'deleted_at']);

        // Fetch only soft-deleted folders and eager load their department
        $archivedFolders = Folder::onlyTrashed()
            ->with('department')
            ->get(['id', 'department_id', 'folderName', 'deleted_at']);

        // Combine and sort by deleted_at (most recently archived first)
        $combined = $archivedFiles->map(function ($item) {
            // Map file data to a unified structure
            return [
                'id' => $item->id,
                'type' => 'file',
                'name' => $item->fileName,
                'department_name' => $item->folder->department->name ?? 'N/A',
                'archived_at' => $item->deleted_at,
                'metadata' => [
                    'original_folder_id' => $item->folder_id,
                    'fileType' => $item->fileType,
                    'fileSize' => $item->fileSize,
                ]
            ];
        })->merge($archivedFolders->map(function ($item) {
            // Map folder data to a unified structure
            return [
                'id' => $item->id,
                'type' => 'folder',
                'name' => $item->folderName,
                'department_name' => $item->department->name ?? 'N/A',
                'archived_at' => $item->deleted_at,
                'metadata' => [
                    'original_department_id' => $item->department_id,
                ]
            ];
        }))->sortByDesc('archived_at')->values();

        return response()->json($combined);
    }

    /**
     * Restore an archived file.
     */
    public function restoreFile($id)
    {
        $file = File::onlyTrashed()->findOrFail($id);
        
        // Restore the file (sets deleted_at to null)
        $file->restore();
        
        // Fetch folder details for logging
        $folder = $file->folder;

        // LOGGING: File Restored
        if (class_exists('App\Models\Activity') && $folder) {
              Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $file->fileName,
                'type'          => 'file',
                'status'        => 'restored',
            ]);
        }

        return response()->json(['message' => 'File restored successfully'], 200);
    }

    /**
     * Restore an archived folder.
     */
    public function restoreFolder($id)
    {
        // NOTE: We only restore the folder itself. Child files/folders remain soft-deleted
        // unless you implement a recursive restore logic.
        
        $folder = Folder::onlyTrashed()->findOrFail($id);
        $folder->restore();

        // LOGGING: Folder Restored
        if (class_exists('App\Models\Activity')) {
              Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id, // Use folder id for context
                'item_name'     => $folder->folderName,
                'type'          => 'folder',
                'status'        => 'restored',
            ]);
        }

        return response()->json(['message' => 'Folder restored successfully. Its contents remain archived and must be restored individually.'], 200);
    }
}
