<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecureImageUpload
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Sadece POST isteklerini kontrol et
        if ($request->isMethod('post') && $request->hasFile('images')) {
            $files = $request->file('images');
            
            foreach ($files as $file) {
                // Dosya türü kontrolü
                $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!in_array($file->getMimeType(), $allowedMimes)) {
                    return back()->withErrors(['images' => 'Geçersiz dosya türü. Sadece JPEG ve PNG dosyaları kabul edilir.']);
                }
                
                // Dosya boyutu kontrolü (10MB - sıkıştırma öncesi maksimum)
                if ($file->getSize() > 10 * 1024 * 1024) {
                    return back()->withErrors(['images' => 'Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.']);
                }
                
                // Dosya adı güvenliği
                $filename = $file->getClientOriginalName();
                if (preg_match('/[^a-zA-Z0-9._-]/', $filename)) {
                    return back()->withErrors(['images' => 'Geçersiz dosya adı.']);
                }
            }
        }
        
        return $next($request);
    }
} 