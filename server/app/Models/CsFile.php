<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CSfolder;

class CsFile extends Model
{
    use HasFactory;

    protected $table = 'tbl_csfiles'; // link to your table

    protected $fillable = [
        'folder_id',
        'fileName',
        'filePath',
        'fileType',
        'fileSize',
    ];

    public function folder()
    {
        return $this->belongsTo(CSfolder::class, 'folder_id');
    }
}
