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
        // Debug: Middleware'in çalışıp çalışmadığını kontrol et
        \Log::info('SecureImageUpload middleware çalışıyor', [
            'route' => $request->route()?->getName(),
            'method' => $request->method(),
            'hasFiles' => $request->hasFile('images')
        ]);

        // Sadece products.store route'unu kontrol et
        if ($request->routeIs('products.store') && $request->isMethod('post') && $request->hasFile('images')) {
            $files = $request->file('images');
            
            \Log::info('Dosya kontrolü başlıyor', ['fileCount' => count($files)]);
            
            // Dosya sayısı kontrolü
            if (count($files) > 5) {
                \Log::info('Dosya sayısı limiti aşıldı');
                return back()->withErrors(['general' => 'Maksimum 5 fotoğraf yükleyebilirsiniz.']);
            }
            
            foreach ($files as $file) {
                // Dosya türü kontrolü
                $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!in_array($file->getMimeType(), $allowedMimes)) {
                    \Log::info('Geçersiz dosya türü', ['mime' => $file->getMimeType()]);
                    return back()->withErrors(['general' => 'Geçersiz dosya türü. Sadece JPEG ve PNG dosyaları kabul edilir.']);
                }
                
                // Dosya boyutu kontrolü (10MB - sıkıştırma öncesi maksimum)
                if ($file->getSize() > 10 * 1024 * 1024) {
                    \Log::info('Dosya boyutu çok büyük', ['size' => $file->getSize()]);
                    return back()->withErrors(['general' => 'Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.']);
                }
                
                // Dosya adı güvenliği - daha esnek
                $filename = $file->getClientOriginalName();
                if (empty($filename) || strlen($filename) > 255) {
                    \Log::info('Geçersiz dosya adı', ['filename' => $filename]);
                    return back()->withErrors(['general' => 'Geçersiz dosya adı.']);
                }
            }
            
            \Log::info('Dosya kontrolü başarılı');
        }
        
        return $next($request);
    }
} 