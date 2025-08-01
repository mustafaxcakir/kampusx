<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    $products = \App\Models\Product::with(['user', 'university'])
        ->where('is_active', true)
        ->latest()
        ->get();
    
    return Inertia::render('welcome', [
        'products' => $products
    ]);
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('ilanver', function () {
        $user = auth()->user();
        $universities = \App\Models\University::orderBy('name')->get(['id', 'name']);
        return Inertia::render('ilanver', [
            'universities' => $universities,
            'userUniversity' => $user->university_id
        ]);
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
        // Rate limiting: 1 dakikada maksimum 3 ürün ekleme
        $key = 'product_create_' . auth()->id();
        if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($key, 3)) {
            return back()->withErrors(['error' => 'Çok fazla ürün eklemeye çalışıyorsunuz. Lütfen biraz bekleyin.']);
        }
        \Illuminate\Support\Facades\RateLimiter::hit($key, 60);
        
        $validated = request()->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0|max:99999999',
            'category' => 'required|string',
            'condition' => 'required|string|in:new,like_new,used',
            'university_id' => 'required|exists:universities,id',
            'images' => 'nullable|array|max:5', // Maksimum 5 fotoğraf
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|dimensions:min_width=100,min_height=100',
        ]);

        $user = auth()->user();
        $product = $user->products()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'category' => $validated['category'],
            'condition' => $validated['condition'],
            'university_id' => $validated['university_id'],
        ]);

        // Fotoğrafları güvenli şekilde kaydet
        if (request()->hasFile('images')) {
            $images = [];
            foreach (request()->file('images') as $image) {
                // Güvenli dosya adı oluştur
                $extension = strtolower($image->getClientOriginalExtension());
                
                // Sadece izin verilen uzantıları kabul et
                $allowedExtensions = ['jpg', 'jpeg', 'png'];
                if (!in_array($extension, $allowedExtensions)) {
                    continue; // Geçersiz dosya türünü atla
                }
                
                // Güvenli dosya adı oluştur
                $safeName = 'product_' . time() . '_' . uniqid() . '.' . $extension;
                
                // Dosyayı kaydet
                $path = $image->storeAs('products', $safeName, 'public');
                $images[] = $path;
            }
            $product->update(['images' => $images]);
        }

        return back()->with('success', 'İlanınız başarıyla oluşturuldu!');
    })->name('products.store');

    // Kullanıcının kendi ilanlarını getir
    Route::get('/my-products', function () {
        $user = auth()->user();
        $products = $user->products()->with('university')->latest()->get();
        return response()->json($products);
    })->name('products.mine');

    // İlan güncelle
    Route::patch('/products/{product}', function ($productId) {
        try {
            // Rate limiting: 1 dakikada maksimum 5 güncelleme
            $key = 'product_update_' . auth()->id();
            if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($key, 5)) {
                return back()->withErrors(['error' => 'Çok fazla güncelleme yapıyorsunuz. Lütfen biraz bekleyin.']);
            }
            \Illuminate\Support\Facades\RateLimiter::hit($key, 60);
            
            $user = auth()->user();
            $product = $user->products()->findOrFail($productId);
        
        $validated = request()->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0|max:99999999',
            'category' => 'required|string',
            'condition' => 'required|string|in:new,like_new,used',
            'university_id' => 'required|exists:universities,id',
        ]);
        
        // Ürünü güncelle (fotoğraflar hariç)
        $product->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'category' => $validated['category'],
            'condition' => $validated['condition'],
            'university_id' => $validated['university_id'],
        ]);
        
        // Güncel ürün verisini al
        $updatedProduct = $product->fresh();
        
        if (request()->wantsJson()) {
            return response()->json(['success' => true, 'product' => $updatedProduct]);
        }
        
        // Inertia.js için güncel ürün verisini döndür
        return back()->with([
            'success' => 'İlan başarıyla güncellendi!',
            'updatedProduct' => $updatedProduct
        ]);
        
        } catch (\Exception $e) {
            \Log::error('Product update error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'product_id' => $productId,
                'request_data' => request()->all()
            ]);
            
            if (request()->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Güncelleme sırasında hata oluştu: ' . $e->getMessage()], 500);
            }
            
            return back()->with('error', 'Güncelleme sırasında hata oluştu!');
        }
    })->name('products.update');

    // İlan sil
    Route::post('/products/{product}/delete', function ($productId) {
        try {
            $user = auth()->user();
            $product = $user->products()->findOrFail($productId);
            $product->delete();
            
            if (request()->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'İlan silindi']);
            }
            
            return back()->with('success', 'İlan başarıyla silindi!');
        } catch (\Exception $e) {
            \Log::error('Product deletion error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'product_id' => $productId
            ]);
            
            if (request()->wantsJson()) {
                return response()->json(['error' => 'İlan silinirken bir hata oluştu'], 500);
            }
            
            return back()->with('error', 'İlan silinirken hata oluştu!');
        }
    })->name('products.delete');

    // Soru-cevap route'ları
    Route::post('/products/{product}/questions', function ($productId) {
        // Rate limiting: 1 dakikada maksimum 5 soru sorma
        $key = 'question_ask_' . auth()->id();
        if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($key, 5)) {
            return back()->with('error', 'Çok fazla soru sordunuz. Lütfen biraz bekleyin.');
        }
        \Illuminate\Support\Facades\RateLimiter::hit($key, 60);
        
        $validated = request()->validate([
            'question' => 'required|string|max:1000',
        ]);

        $user = auth()->user();
        $product = \App\Models\Product::findOrFail($productId);

        // Kendi ürününe soru soramaz
        if ($product->user_id === $user->id) {
            return back()->with('error', 'Kendi ürününüze soru soramazsınız!');
        }

        $question = $product->questions()->create([
            'asked_by_user_id' => $user->id,
            'question' => $validated['question'],
        ]);

        return back()->with('success', 'Sorunuz başarıyla gönderildi!');
    })->name('questions.store');

    // Soruya cevap ver (sadece ürün sahibi)
    Route::post('/questions/{question}/answer', function ($questionId) {
        $validated = request()->validate([
            'answer' => 'required|string|max:1000',
        ]);

        $user = auth()->user();
        $question = \App\Models\ProductQuestion::with('product')->findOrFail($questionId);

        // Sadece ürün sahibi cevap verebilir
        if ($question->product->user_id !== $user->id) {
            abort(403, 'Bu soruya cevap verme yetkiniz yok!');
        }

        $question->update([
            'answer' => $validated['answer'],
            'answered_at' => now(),
        ]);

        return back()->with('success', 'Cevabınız başarıyla gönderildi!');
    })->name('questions.answer');

    // Soruyu sil (sadece soruyu soran kişi)
    Route::delete('/questions/{question}', function ($questionId) {
        $user = auth()->user();
        $question = \App\Models\ProductQuestion::findOrFail($questionId);

        // Sadece soruyu soran kişi silebilir
        if ($question->asked_by_user_id !== $user->id) {
            abort(403, 'Bu soruyu silme yetkiniz yok!');
        }

        $question->delete();

        return back()->with('success', 'Sorunuz silindi!');
    })->name('questions.delete');

    // Favori işlemleri
    Route::post('/products/{product}/favorite', function ($productId) {
        // Rate limiting: 1 dakikada maksimum 10 favori ekleme
        $key = 'favorite_add_' . auth()->id();
        if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($key, 10)) {
            return back()->withErrors(['error' => 'Çok fazla deneme yaptınız. Lütfen biraz bekleyin.']);
        }
        \Illuminate\Support\Facades\RateLimiter::hit($key, 60);
        
        $user = auth()->user();
        $product = \App\Models\Product::findOrFail($productId);
        
        // Kendi ürününü favorilere ekleyemez
        if ($product->user_id === $user->id) {
            return back()->withErrors(['error' => 'Kendi ürününüzü favorilere ekleyemezsiniz!']);
        }
        
        // Zaten favorilerde mi kontrol et
        $existingFavorite = $user->favorites()->where('product_id', $productId)->first();
        
        if ($existingFavorite) {
            return back()->withErrors(['error' => 'Bu ürün zaten favorilerinizde!']);
        }
        
        // Favorilere ekle
        $user->favorites()->create([
            'product_id' => $productId
        ]);
        
        return back()->with('success', 'Ürün favorilerinize eklendi!');
    })->name('favorites.add');

    Route::delete('/products/{product}/favorite', function ($productId) {
        $user = auth()->user();
        
        // Favoriyi kaldır
        $user->favorites()->where('product_id', $productId)->delete();
        
        return back()->with('success', 'Ürün favorilerinizden kaldırıldı!');
    })->name('favorites.remove');

    // Favorilerim sayfası
    Route::get('/favorilerim', function () {
        $user = auth()->user();
        $favorites = $user->favoriteProducts()->with(['user', 'university'])->latest()->get();
        
        return Inertia::render('favorilerim', [
            'favorites' => $favorites
        ]);
    })->name('favorilerim');

    // Favori ürün ID'lerini JSON olarak döndür
    Route::get('/api/favorites', function () {
        $user = auth()->user();
        $favorites = $user->favoriteProducts()->pluck('id');
        
        return response()->json($favorites);
    })->name('api.favorites');
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
    
    // Kullanıcının ürünlerini getir
    $ads = $user->products()->with('university')->latest()->get();
    
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

// Ürün detay sayfası
Route::get('/urun/{id}', function ($id) {
    // ID'nin sayısal olduğunu kontrol et
    if (!is_numeric($id) || $id <= 0) {
        abort(404);
    }
    
    $page = request()->get('page', 1);
    $product = \App\Models\Product::with(['user.university', 'university', 'questions.askedBy'])->findOrFail($id);
    $viewer = auth()->user();
    
    // Satıcı bilgileri
    $seller = $product->user;
    $sellerData = [
        'name' => $seller->name,
        'surname' => $seller->surname,
        'unique_id' => $seller->unique_id,
        'about' => $seller->about,
        'phone' => $seller->isFieldVisible('phone', $viewer) ? $seller->phone : null,
        'email' => $seller->isFieldVisible('email', $viewer) ? $seller->email : null,
        'university_name' => $seller->isFieldVisible('university', $viewer) ? ($seller->university ? $seller->university->name : null) : null,
        'created_at' => $seller->created_at,
    ];

    // Favori durumunu kontrol et
    $isFavorited = false;
    if ($viewer) {
        $isFavorited = $viewer->favorites()->where('product_id', $product->id)->exists();
    }

    // Soruları hazırla (pagination ile)
    $questionsQuery = $product->publicQuestions()->with('askedBy');
    $questions = $questionsQuery->paginate(5, ['*'], 'page', $page)->through(function ($question) {
        return [
            'id' => $question->id,
            'question' => $question->question,
            'answer' => $question->answer,
            'answered_at' => $question->answered_at,
            'created_at' => $question->created_at,
            'asked_by' => [
                'name' => $question->askedBy->name,
                'surname' => $question->askedBy->surname,
                'unique_id' => $question->askedBy->unique_id,
            ],
            'is_answered' => $question->isAnswered(),
        ];
    });
    
    return Inertia::render('urun', [
        'product' => $product,
        'seller' => $sellerData,
        'viewer' => $viewer,
        'questions' => $questions,
        'isFavorited' => $isFavorited,
    ]);
})->name('product.show');

// Ürünü satıldı olarak işaretle
Route::patch('/urun/{id}/mark-as-sold', function ($id) {
    $product = \App\Models\Product::findOrFail($id);
    
    // Sadece ürün sahibi işaretleyebilir
    if (auth()->id() !== $product->user_id) {
        abort(403, 'Bu işlemi yapmaya yetkiniz yok');
    }
    
    $product->update(['is_active' => false]);
    
    return back()->with('success', 'Ürün başarıyla satıldı olarak işaretlendi');
})->middleware('auth')->name('product.mark-as-sold');

// Kategori sayfaları
Route::get('/kategori/{category}', function ($category) {
    $validCategories = [
        'electronics' => 'Elektronik',
        'books' => 'Kitap', 
        'clothing' => 'Giyim',
        'sports' => 'Spor',
        'home' => 'Ev & Yaşam',
        'automotive' => 'Otomotiv',
        'other' => 'Diğer'
    ];
    
    if (!array_key_exists($category, $validCategories)) {
        abort(404, 'Kategori bulunamadı');
    }
    
    $products = \App\Models\Product::with(['user', 'university'])
        ->where('category', $category)
        ->where('is_active', true)
        ->latest()
        ->paginate(20);
    
    return Inertia::render('kategori', [
        'category' => $category,
        'categoryName' => $validCategories[$category],
        'products' => $products,
        'allCategories' => $validCategories
    ]);
})->name('category.show');

