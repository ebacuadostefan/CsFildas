<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Import SoftDeletes trait
use App\Models\Folder;

class File extends Model
{
    use HasFactory, SoftDeletes; // Use SoftDeletes trait

    protected $table = 'tbl_files'; // link to your table

    protected $fillable = [
        'folder_id',
        'fileName',
        'filePath',
        'fileType',
        'fileSize',
    ];

    /**
     * The attributes that should be mutated to dates.
     * Required for SoftDeletes to work correctly.
     */
    protected $dates = ['deleted_at']; // Add 'deleted_at' to date mutations

    public function folder()
    {
        return $this->belongsTo(Folder::class, 'folder_id')->withTrashed();
    }
}
