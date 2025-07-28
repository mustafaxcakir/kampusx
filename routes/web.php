<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function () {
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
    
    Route::post('/products', function () {
        $validated = request()->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'condition' => 'required|string|in:new,like_new,used',
            'location' => 'nullable|string|max:255',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();
        $product = $user->products()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'category' => $validated['category'],
            'condition' => $validated['condition'],
            'location' => $validated['location'],
        ]);

        // Fotoğrafları kaydet
        if (request()->hasFile('images')) {
            $images = [];
            foreach (request()->file('images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = $path;
            }
            $product->update(['images' => $images]);
        }

        return redirect()->route('dashboard')->with('success', 'İlanınız başarıyla oluşturuldu!');
    })->name('products.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Public profile route - herkes görebilir (auth gerektirmez)
Route::get('profil/{unique_id}', function ($unique_id) {
    $user = \App\Models\User::with('university')->where('unique_id', $unique_id)->first();
    
    if (!$user) {
        abort(404, 'Kullanıcı bulunamadı: ' . $unique_id);
    }
    
    // Görüntüleyen kullanıcı (auth varsa)
    $viewer = auth()->user();
    
    // İlanlar henüz yok, boş array döndürüyoruz
    $ads = [];
    
    return Inertia::render('publicprofil', [
        'user' => [
            'name' => $user->name,
            'surname' => $user->surname,
            'unique_id' => $user->unique_id,
            'about' => $user->about,
            'phone' => $user->isFieldVisible('phone', $viewer) ? $user->phone : null,
            'email' => $user->isFieldVisible('email', $viewer) ? $user->email : null,
            'university_id' => $user->university_id,
            'university_name' => $user->isFieldVisible('university', $viewer) ? ($user->university ? $user->university->name : null) : null,
            'created_at' => $user->created_at,
            'stats' => [
                'ratings' => 0,
                'followers' => 0,
                'following' => 0
            ],
            // Gizlilik bilgileri (sadece kendi profilinde gösterilir)
            'privacy_info' => $viewer && $viewer->id === $user->id ? [
                'email_privacy' => $user->email_privacy,
                'phone_privacy' => $user->phone_privacy,

                'university_privacy' => $user->university_privacy,
            ] : null
        ],
        'ads' => $ads
    ]);
})->name('public.profile');


