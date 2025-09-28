<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = [
        'action_type',
        'model',
        'description',
        'user_created',
        'user_updated'
    ];
}
