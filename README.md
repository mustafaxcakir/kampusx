## KampusX — Öğrenciler Arası E‑Ticaret ve Askıda Platformu

KampusX, öğrencilerin kendi okulları içinde ikinci el eşya alım‑satımı yapabildiği; favori, takip, soru‑cevap ve bildirim gibi sosyal özellikler sunan bir web uygulamasıdır. Proje aynı zamanda “askıda” (bağış/kredi) ve geri dönüşüm gibi sosyal fayda modülleri için altyapı hedefler.

### Başlıca Özellikler
- **Üyelik ve Doğrulama**: Üniversite seçimi ve e‑posta domain eşleşmesi ile kayıt.
- **İlan Yönetimi**: Ürün ekleme/düzenleme/silme; çoklu görsel yükleme ve oran/dosya türü kontrolleri; oranlı rate‑limit.
- **Favoriler**: İlanı favorilere ekleme/kaldırma; favorilerim sayfası.
- **Takip**: Kullanıcıyı takip et/çık; takipçi/takip edilen listeleri.
- **Soru‑Cevap**: Ürünlere soru sorma; sadece satıcının cevaplayabildiği akış.
- **Bildirimler**: Takip/favori/soru/cevap için bildirimler; okundu/okunmadı yönetimi.
- **Profil ve Gizlilik**: E‑posta/telefon/üniversite görünürlüğü için gizlilik ayarları.

### Mimari Kısa Özet
- **Backend**: Laravel 12, Inertia.js köprüsü, klasik session auth.
- **Frontend**: React 19 + Vite 7 + TailwindCSS 4 + Radix UI bileşenleri.
- **Veritabanı**: Varsayılan SQLite (dosya: `database/database.sqlite`).
- **Depolama**: Public disk üzerinden `storage/app/public` → `public/storage` sembolik link.
- **Bildirim Sistemi**: Özel `notifications` tablosu ve `NotificationService` ile tekil/tekrarsız bildirim üretimi.

## Gereksinimler
- PHP 8.2+
- Composer 2.x
- Node.js 20+
- NPM 10+ (veya pnpm/yarn)

## Kurulum
1) Kaynakları indir ve bağımlılıkları kur
```bash
composer install
npm install
```

2) .env dosyasını oluştur
```bash
# Windows PowerShell
copy .env.example .env

# veya Bash
cp .env.example .env
```

3) Veritabanını hazırla (SQLite)
```bash
# Windows PowerShell
ni .\database\database.sqlite -ItemType File

# veya CMD
type nul > database\database.sqlite
```

4) Uygulama anahtarını üret ve bağlantıları kur
```bash
php artisan key:generate
php artisan storage:link
php artisan migrate
```

5) (İsteğe bağlı) Örnek veriler
```bash
php artisan db:seed --class=UniversitySeeder
php artisan db:seed --class=ProductSeeder
```

## Geliştirme
- Tüm servisleri tek komutla (PHP server + queue + Vite):
```bash
composer run dev
```

- Ayrı ayrı çalıştırmak istersen:
```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

- SSR geliştirme (hazır):
```bash
composer run dev:ssr
```

## Üretim (Build)
```bash
npm run build
```
Oluşan varlıklar Vite üzerinden servis edilir. Laravel tarafında tipik dağıtım adımları (env, cache clear, optimize, storage link, vb.) uygulanmalıdır.

## Çevre Değişkenleri (.env)
Örnek önemli anahtarlar:
```
APP_NAME="KampusX"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

FILESYSTEM_DISK=public
QUEUE_CONNECTION=database
```

> Not: `QUEUE_CONNECTION=database` için işler yoğunlaştığında `php artisan queue:listen` veya Supervisor ile kalıcı worker önerilir. Gerekli jobs tablosu migration’da mevcuttur.

## Klasör Yapısı (özet)
- `app/Models` — `User`, `Product`, `University`, `Favorite`, `Follow`, `Notification`, `ProductQuestion`
- `app/Http/Controllers` — Auth, Settings, Follow, Notification vb.
- `app/Observers` — Favori ve Soru için bildirim tetikleyicileri.
- `app/Services/NotificationService.php` — Bildirim üretimi/okundu/silme.
- `routes/web.php` — İlan CRUD, favori/takip, Soru‑Cevap, bildirimler, profil sayfaları.
- `routes/settings.php` — Profil, şifre, gizlilik ayarları.
- `resources/js` — React sayfaları, bileşenler, layout’lar.
- `database/migrations` — Tüm tablo şemaları.
- `database/seeders` — Üniversite/Ürün örnek verileri.

## Önemli Akışlar
- **Kayıt**: Üniversite seçimi + e‑posta domain eşleşmesi kontrolü.
- **İlan**: Çoklu görsel yükleme (jpg/png), temel görsel boyut doğrulamaları.
- **Favori/Takip**: Tekrarlı favori ve kendini takip etme engelleri, rate‑limit.
- **Soru‑Cevap**: Satıcı dışı kullanıcı soru sorar; yalnızca satıcı cevaplar.
- **Bildirimler**: Aynı olayın 24 saat içindeki tekrarında duplikasyon önleme.
- **Gizlilik**: `email/phone/university` alanlarına `public/members/private` seviyeleri.

## Test, Lint ve Tip Kontrol
```bash
composer run test     # PHP testleri (Pest)
npm run lint          # ESLint
npm run types         # TypeScript tip kontrol
```

## Yol Haritası (Roadmap)
- Sipariş akışı (sepet/satın alma/teslim/iptal durumları)
- Cüzdan/bakiye ve **Askıda** (bağış havuzu, kriterler, dağıtım)
- Mesajlaşma (ürün bazlı, gerçek zamanlı)
- Moderasyon/raporlama ve admin paneli
- Ödeme entegrasyonu (PayTR/İyzico) veya demo kredi sistemi
- E‑posta doğrulama zorunluluğu ve güvenlik iyileştirmeleri

## Lisans
MIT


