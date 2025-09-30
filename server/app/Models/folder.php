<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes; // 1. Import SoftDeletes trait

class Folder extends Model
{
    use SoftDeletes; // 2. Use the SoftDeletes trait

    protected $table = 'tbl_folder'; // Keeping your specified table name

    protected $fillable = [
        'folderName',
        'description',
        'slug',
        'department_id',
    ];

    public $timestamps = true;

    /**
     * The attributes that should be mutated to dates.
     * Required for SoftDeletes to work correctly.
     */
    protected $dates = ['deleted_at']; // 3. Add 'deleted_at' to date mutations

    protected static function boot()
{
    parent::boot();

    // Existing slug generator stays here...
    static::creating(function ($folder) {
        if (empty($folder->slug)) {
            $slug = \Illuminate\Support\Str::slug($folder->folderName);
            $original = $slug;
            $count = 1;

            while (self::withTrashed()->where('slug', $slug)->exists()) {
                $slug = $original . '-' . $count++;
            }

            $folder->slug = $slug;
        }
    });

    // Notify on created
    static::created(function ($folder) {
        \App\Models\Notification::create([
            'action' => 'created',
            'item_type' => 'folder',
            'item_name' => $folder->folderName,
        ]);
    });

    // Notify on updated
    static::updated(function ($folder) {
        \App\Models\Notification::create([
            'action' => 'updated',
            'item_type' => 'folder',
            'item_name' => $folder->folderName,
        ]);
    });

    // Notify on soft delete
    static::deleted(function ($folder) {
        \App\Models\Notification::create([
            'action' => 'deleted',
            'item_type' => 'folder',
            'item_name' => $folder->folderName,
        ]);
    });
}


    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function files()
    {
        // Files are also soft-deletable, so we define the standard relationship.
        return $this->hasMany(File::class, 'folder_id');
    }
}
