<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Folder;

class File extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_files'; // link to your table

    protected $fillable = [
        'folder_id',
        'fileName',
        'filePath',
        'fileType',
        'fileSize',
    ];

    protected $dates = ['deleted_at']; // Soft delete column

    protected static function boot()
    {
        parent::boot();

        // Notify on created
        static::created(function ($file) {
            \App\Models\Notification::create([
                'action'    => 'created',
                'item_type' => 'file',
                'item_name' => $file->fileName,
            ]);
        });

        // Notify on updated
        static::updated(function ($file) {
            \App\Models\Notification::create([
                'action'    => 'updated',
                'item_type' => 'file',
                'item_name' => $file->fileName,
            ]);
        });

        // Notify on soft deleted
        static::deleted(function ($file) {
            \App\Models\Notification::create([
                'action'    => 'deleted',
                'item_type' => 'file',
                'item_name' => $file->fileName,
            ]);
        });
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class, 'folder_id')->withTrashed();
    }
}
