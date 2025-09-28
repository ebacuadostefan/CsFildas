<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Folder extends Model
{
    protected $table = 'tbl_folder';

    protected $fillable = [
        'folderName',
        'description',
        'slug',
        'department_id',
    ];

   protected static function boot()
{
    parent::boot();

    static::creating(function ($folder) {
        if (empty($folder->slug)) {
            // Generate initials instead of full slug
            $words = explode(' ', $folder->folderName);
            $folder->slug = strtolower(collect($words)->map(fn($w) => $w[0])->join(''));
        }
    });
}


    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function files()
    {
        return $this->hasMany(File::class, 'folder_id');
    }
}
