<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Folder;

class File extends Model
{
    use HasFactory;

    protected $table = 'tbl_files'; // link to your table

    protected $fillable = [
        'folder_id',
        'fileName',
        'filePath',
        'fileType',
        'fileSize',
    ];

    public function folder()
    {
        return $this->belongsTo(Folder::class, 'folder_id');
    }
}
