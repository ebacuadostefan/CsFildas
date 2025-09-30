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
        try {
            // Query builder approach to avoid relationship pitfalls
            $files = DB::table('tbl_files')
                ->whereNotNull('tbl_files.deleted_at')
                ->leftJoin('tbl_folder', 'tbl_folder.id', '=', 'tbl_files.folder_id')
                ->leftJoin('departments', 'departments.id', '=', 'tbl_folder.department_id')
                ->select(
                    'tbl_files.id as id',
                    DB::raw("'file' as type"),
                    'tbl_files.fileName as name',
                    'departments.name as department_name',
                    'tbl_files.deleted_at as archived_at',
                    'tbl_files.folder_id as original_folder_id',
                    'tbl_files.fileType',
                    'tbl_files.fileSize'
                )
                ->get()
                ->map(function ($row) {
                    return [
                        'id' => $row->id,
                        'type' => 'file',
                        'name' => $row->name,
                        'department_name' => $row->department_name ?? 'N/A',
                        'archived_at' => $row->archived_at,
                        'metadata' => [
                            'original_folder_id' => $row->original_folder_id,
                            'fileType' => $row->fileType,
                            'fileSize' => $row->fileSize,
                        ],
                    ];
                });

            $folders = DB::table('tbl_folder')
                ->whereNotNull('tbl_folder.deleted_at')
                ->leftJoin('departments', 'departments.id', '=', 'tbl_folder.department_id')
                ->select(
                    'tbl_folder.id as id',
                    DB::raw("'folder' as type"),
                    'tbl_folder.folderName as name',
                    'departments.name as department_name',
                    'tbl_folder.deleted_at as archived_at',
                    'tbl_folder.department_id as original_department_id'
                )
                ->get()
                ->map(function ($row) {
                    return [
                        'id' => $row->id,
                        'type' => 'folder',
                        'name' => $row->name,
                        'department_name' => $row->department_name ?? 'N/A',
                        'archived_at' => $row->archived_at,
                        'metadata' => [
                            'original_department_id' => $row->original_department_id,
                        ],
                    ];
                });

            $combined = $files->merge($folders)->sortByDesc('archived_at')->values();

            return response()->json($combined);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load archive',
                'error' => $e->getMessage(),
            ], 500);
        }
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

        // LOGGING: File Restored (use 'added' to represent back to active)
        if (class_exists('App\\Models\\Activity') && $folder) {
              Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id,
                'item_name'     => $file->fileName,
                'type'          => 'file',
                'status'        => 'added',
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

        // LOGGING: Folder Restored (use 'added' to represent back to active)
        if (class_exists('App\\Models\\Activity')) {
              Activity::create([
                'department_id' => $folder->department_id,
                'folder_id'     => $folder->id, // Use folder id for context
                'item_name'     => $folder->folderName,
                'type'          => 'folder',
                'status'        => 'added',
            ]);
        }

        return response()->json(['message' => 'Folder restored successfully. Its contents remain archived and must be restored individually.'], 200);
    }
}
