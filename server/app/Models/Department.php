<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Department extends Model
{
    protected $fillable = [
        'name',
        'alias',
        'slug',
        'image',
    ];
 
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($department) {
            if (empty($department->slug)) {
                $department->slug = Str::slug($department->name);
            }
        });
    }

    public function folders()
    {
        return $this->hasMany(Folder::class, 'department_id');
    }
}

