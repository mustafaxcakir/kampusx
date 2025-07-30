<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'asked_by_user_id',
        'question',
        'answer',
        'answered_at',
        'is_public',
    ];

    protected $casts = [
        'answered_at' => 'datetime',
        'is_public' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function askedBy()
    {
        return $this->belongsTo(User::class, 'asked_by_user_id');
    }

    public function isAnswered()
    {
        return !is_null($this->answer);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeUnanswered($query)
    {
        return $query->whereNull('answer');
    }

    public function scopeAnswered($query)
    {
        return $query->whereNotNull('answer');
    }
}
