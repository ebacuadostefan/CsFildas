<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// CRITICAL FIX: Ensure Department and Folder models are imported
use App\Models\Department; 
use App\Models\Folder; 

class Activity extends Model
{
    // Assuming 'activities' is the table name based on the migration
    protected $table = 'activities'; 

    protected $fillable = [
        'department_id',
        'folder_id',
        'item_name',
        'type',
        'status',
    ];

    /**
     * Get the department associated with the activity.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the folder associated with the activity (optional).
     * FIX: Use withTrashed() so the activity log can link to folders 
     * even if they have been soft-deleted (archived).
     */
    public function folder()
    {
        return $this->belongsTo(Folder::class)->withTrashed();
    }
}
