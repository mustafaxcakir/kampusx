<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('ilanver', function () {
        return Inertia::render('ilanver');
    })->name('ilanver');
    
    Route::get('ilanlarim', function () {
        return Inertia::render('ilanlarim');
    })->name('ilanlarim');
    
    Route::get('favorilerim', function () {
        return Inertia::render('favorilerim');
    })->name('favorilerim');
    
    Route::get('profil', function () {
        $user = auth()->user();
        $user->load('university');
        
        // Kendi profil sayfasına yönlendir
        return redirect()->route('public.profile', ['unique_id' => $user->unique_id]);
    })->name('profil');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Public profile route - herkes görebilir (auth gerektirmez)
Route::get('profil/{unique_id}', function ($unique_id) {
    $user = \App\Models\User::with('university')->where('unique_id', $unique_id)->first();
    
    if (!$user) {
        abort(404, 'Kullanıcı bulunamadı: ' . $unique_id);
    }
    
    // İlanlar henüz yok, boş array döndürüyoruz
    $ads = [];
    
    return Inertia::render('publicprofil', [
        'user' => [
            'name' => $user->name,
            'surname' => $user->surname,
            'unique_id' => $user->unique_id,
            'about' => $user->about,
            'phone' => $user->phone,
            'email' => $user->email,
            'university_id' => $user->university_id,
            'university_name' => $user->university ? $user->university->name : null,
            'created_at' => $user->created_at,
            'stats' => [
                'ratings' => 0,
                'followers' => 0,
                'following' => 0
            ]
        ],
        'ads' => $ads
    ]);
})->name('public.profile');


