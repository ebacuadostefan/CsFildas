<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CSfolder extends Model
{
    protected $table = 'tbl_csfolder';

    protected $fillable = [
        'folderName',
        'description',
    ];
}
