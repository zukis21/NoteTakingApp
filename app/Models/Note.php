<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'is_public',
        'edited_at'
    ];

    protected $casts = [
        'edited_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sharedUsers()
    {
        return $this->belongsToMany(User::class, 'note_shares');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function wasEdited()
    {
        return !is_null($this->edited_at);
    }
}
