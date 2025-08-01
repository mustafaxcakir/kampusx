<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'price',
        'category',
        'condition',
        'images',
        'university_id',
        'is_active',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function questions()
    {
        return $this->hasMany(ProductQuestion::class)->orderBy('created_at', 'desc');
    }

    public function publicQuestions()
    {
        return $this->questions()->public();
    }

    public function unansweredQuestions()
    {
        return $this->questions()->unanswered();
    }

    public function answeredQuestions()
    {
        return $this->questions()->answered();
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 2) . ' ₺';
    }

    public function getFirstImageAttribute()
    {
        return $this->images ? $this->images[0] : null;
    }

    // Güvenli resim URL'leri için
    public function getSafeImagesAttribute()
    {
        if (!$this->images) return [];
        
        return array_map(function($image) {
            // Sadece güvenli dosya uzantılarına izin ver
            $extension = pathinfo($image, PATHINFO_EXTENSION);
            $allowedExtensions = ['jpg', 'jpeg', 'png'];
            
            if (!in_array(strtolower($extension), $allowedExtensions)) {
                return null;
            }
            
            return $image;
        }, $this->images);
    }
}
