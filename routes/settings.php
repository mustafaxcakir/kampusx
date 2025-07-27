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

    Route::get('ayarlar/gorunum', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
