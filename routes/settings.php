<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('ayarlar', '/ayarlar/profil');

    Route::get('ayarlar/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('ayarlar/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('ayarlar/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('ayarlar/sifre', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('ayarlar/sifre', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

                    Route::get('ayarlar/gizlilik', function () {
                    $user = auth()->user();
                    return Inertia::render('settings/privacy', [
                        'privacySettings' => [
                            'email_privacy' => $user->email_privacy,
                            'phone_privacy' => $user->phone_privacy,

                            'university_privacy' => $user->university_privacy,
                        ]
                    ]);
                })->name('settings.privacy');

    Route::patch('ayarlar/gizlilik', function () {
        $user = auth()->user();
                            $user->update(request()->only(['email_privacy', 'phone_privacy', 'university_privacy']));
        return back()->with('status', 'Gizlilik ayarları güncellendi.');
    })->name('settings.privacy.update');

    Route::get('ayarlar/gorunum', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('ayarlar/hesap-sil', function () {
        return Inertia::render('settings/hesap-sil');
    })->name('hesap-sil');
});
