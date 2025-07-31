<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitUploads
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Debug: Middleware'in çalışıp çalışmadığını kontrol et
        \Log::info('RateLimitUploads middleware çalışıyor', [
            'route' => $request->route()?->getName(),
            'method' => $request->method(),
            'ip' => $request->ip()
        ]);

        // Sadece products.store route'unu kontrol et
        if ($request->routeIs('products.store')) {
            $key = 'uploads:' . $request->ip();
            
            // Ticaret sitesi için daha uygun limitler:
            // 1 saatte maksimum 20 ilan, 1 dakikada maksimum 3 ilan
            $hourlyKey = 'uploads_hourly:' . $request->ip();
            $minuteKey = 'uploads_minute:' . $request->ip();
            
            \Log::info('Rate limit kontrolü başlıyor', [
                'hourlyKey' => $hourlyKey,
                'minuteKey' => $minuteKey
            ]);
            
            // Saatlik limit kontrolü
            if (RateLimiter::tooManyAttempts($hourlyKey, 20)) {
                $minutes = ceil(RateLimiter::availableIn($hourlyKey) / 60);
                \Log::info('Saatlik limit aşıldı', ['minutes' => $minutes]);
                
                return back()->withErrors([
                    'general' => "Çok fazla ilan yükleme denemesi. {$minutes} dakika sonra tekrar deneyin."
                ]);
            }
            
            // Dakikalık limit kontrolü
            if (RateLimiter::tooManyAttempts($minuteKey, 3)) {
                $seconds = RateLimiter::availableIn($minuteKey);
                \Log::info('Dakikalık limit aşıldı', ['seconds' => $seconds]);
                
                return back()->withErrors([
                    'general' => "Çok hızlı ilan yükleme. {$seconds} saniye sonra tekrar deneyin."
                ]);
            }
            
            RateLimiter::hit($hourlyKey, 3600); // 1 saat
            RateLimiter::hit($minuteKey, 60); // 1 dakika
            
            \Log::info('Rate limit kontrolü başarılı');
        }
        
        return $next($request);
    }
} 