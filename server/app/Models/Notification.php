<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['action', 'item_type', 'item_name', 'is_read'];
}
