<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'about',
        'phone',
        'password',
        'university_id',
        'unique_id',
        'email_privacy',
        'phone_privacy',
        'university_privacy',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Belirli bir alanın görünürlüğünü kontrol eder
     */
    public function isFieldVisible(string $field, ?User $viewer = null): bool
    {
        $privacyField = $field . '_privacy';
        
        if (!isset($this->$privacyField)) {
            return true; // Gizlilik ayarı yoksa varsayılan olarak görünür
        }

        switch ($this->$privacyField) {
            case 'public':
                return true;
            case 'members':
                return $viewer !== null; // Sadece üyeler görebilir
            case 'private':
                return $viewer && $viewer->id === $this->id; // Sadece kendisi görebilir
            default:
                return false;
        }
    }

    /**
     * Generate a unique 10-digit ID
     */
    public static function generateUniqueId(): string
    {
        do {
            $uniqueId = str_pad(mt_rand(0, 9999999999), 10, '0', STR_PAD_LEFT);
        } while (self::where('unique_id', $uniqueId)->exists());

        return $uniqueId;
    }
}
