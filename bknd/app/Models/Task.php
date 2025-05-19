<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    //

    use HasFactory, Notifiable,SoftDeletes;
    protected $fillable = [
        'id',
        'titulo',
        'descripcion',
        'estado',
        'user_id',
    ];

}
