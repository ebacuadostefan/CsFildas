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

        static::creating(function ($folder) {
            if (empty($folder->slug)) {
                // Generate slug from name (safer than just initials)
                $slug = Str::slug($folder->folderName);

                // Ensure unique slug
                $original = $slug;
                $count = 1;

                // IMPORTANT: When checking for existence, we use ->withTrashed() 
                // to make sure we don't duplicate a slug from an archived item.
                while (self::withTrashed()->where('slug', $slug)->exists()) {
                    $slug = $original . '-' . $count++;
                }

                $folder->slug = $slug;
            }
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
