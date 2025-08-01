<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;
use App\Models\University;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kategoriler ve ürün verileri
        $categories = [
            'electronics' => [
                ['title' => 'iPhone 13 Pro', 'price' => 15000, 'condition' => 'like_new'],
                ['title' => 'MacBook Air M1', 'price' => 25000, 'condition' => 'used'],
                ['title' => 'Samsung Galaxy S21', 'price' => 8000, 'condition' => 'used'],
                ['title' => 'iPad Pro 11"', 'price' => 12000, 'condition' => 'like_new'],
                ['title' => 'AirPods Pro', 'price' => 3000, 'condition' => 'used'],
                ['title' => 'Dell XPS 13', 'price' => 18000, 'condition' => 'like_new'],
                ['title' => 'Sony WH-1000XM4', 'price' => 4000, 'condition' => 'used'],
                ['title' => 'Nintendo Switch', 'price' => 3500, 'condition' => 'used'],
                ['title' => 'GoPro Hero 9', 'price' => 2500, 'condition' => 'like_new'],
                ['title' => 'Canon EOS R6', 'price' => 35000, 'condition' => 'used']
            ],
            'books' => [
                ['title' => 'Kalkülüs: Erken Transandantal', 'price' => 150, 'condition' => 'used'],
                ['title' => 'Fizik: Temel Prensipler', 'price' => 200, 'condition' => 'like_new'],
                ['title' => 'Organik Kimya', 'price' => 180, 'condition' => 'used'],
                ['title' => 'Mikroekonomi Teorisi', 'price' => 120, 'condition' => 'used'],
                ['title' => 'Veri Yapıları ve Algoritmalar', 'price' => 160, 'condition' => 'like_new'],
                ['title' => 'İşletme Yönetimi', 'price' => 140, 'condition' => 'used'],
                ['title' => 'Psikolojiye Giriş', 'price' => 100, 'condition' => 'used'],
                ['title' => 'Türk Edebiyatı Tarihi', 'price' => 90, 'condition' => 'like_new'],
                ['title' => 'İngilizce Dilbilgisi', 'price' => 80, 'condition' => 'used'],
                ['title' => 'Matematik Analiz', 'price' => 170, 'condition' => 'used']
            ],
            'clothing' => [
                ['title' => 'Nike Air Force 1', 'price' => 800, 'condition' => 'used'],
                ['title' => 'Adidas Ultraboost', 'price' => 1200, 'condition' => 'like_new'],
                ['title' => 'Levi\'s 501 Jeans', 'price' => 300, 'condition' => 'used'],
                ['title' => 'Zara Blazer Ceket', 'price' => 400, 'condition' => 'like_new'],
                ['title' => 'H&M Kış Montu', 'price' => 600, 'condition' => 'used'],
                ['title' => 'Converse Chuck Taylor', 'price' => 500, 'condition' => 'used'],
                ['title' => 'Mavi Gömlek', 'price' => 150, 'condition' => 'like_new'],
                ['title' => 'Kot Etek', 'price' => 200, 'condition' => 'used'],
                ['title' => 'Spor Ayakkabı', 'price' => 350, 'condition' => 'used'],
                ['title' => 'Kazak', 'price' => 100, 'condition' => 'like_new']
            ],
            'sports' => [
                ['title' => 'Futbol Topu', 'price' => 200, 'condition' => 'used'],
                ['title' => 'Basketbol Topu', 'price' => 300, 'condition' => 'like_new'],
                ['title' => 'Tenis Raketi', 'price' => 500, 'condition' => 'used'],
                ['title' => 'Yoga Matı', 'price' => 150, 'condition' => 'like_new'],
                ['title' => 'Koşu Ayakkabısı', 'price' => 800, 'condition' => 'used'],
                ['title' => 'Bisiklet', 'price' => 2500, 'condition' => 'used'],
                ['title' => 'Ağırlık Seti', 'price' => 1000, 'condition' => 'used'],
                ['title' => 'Pilates Topu', 'price' => 100, 'condition' => 'like_new'],
                ['title' => 'Badminton Raketi', 'price' => 200, 'condition' => 'used'],
                ['title' => 'Voleybol Topu', 'price' => 250, 'condition' => 'like_new']
            ],
            'home' => [
                ['title' => 'Kahve Makinesi', 'price' => 800, 'condition' => 'used'],
                ['title' => 'Blender', 'price' => 300, 'condition' => 'like_new'],
                ['title' => 'Ütü', 'price' => 400, 'condition' => 'used'],
                ['title' => 'Mikrodalga Fırın', 'price' => 600, 'condition' => 'used'],
                ['title' => 'Çamaşır Makinesi', 'price' => 2000, 'condition' => 'used'],
                ['title' => 'Buzdolabı', 'price' => 3500, 'condition' => 'used'],
                ['title' => 'Televizyon', 'price' => 2500, 'condition' => 'used'],
                ['title' => 'Koltuk Takımı', 'price' => 1500, 'condition' => 'used'],
                ['title' => 'Masa Sandalye', 'price' => 800, 'condition' => 'used'],
                ['title' => 'Lamba', 'price' => 150, 'condition' => 'like_new']
            ],
            'automotive' => [
                ['title' => 'Araba Lastiği', 'price' => 800, 'condition' => 'used'],
                ['title' => 'Araba Aküsü', 'price' => 1200, 'condition' => 'like_new'],
                ['title' => 'Araba Radyosu', 'price' => 500, 'condition' => 'used'],
                ['title' => 'Araba Koltuğu', 'price' => 1000, 'condition' => 'used'],
                ['title' => 'Araba Aynası', 'price' => 300, 'condition' => 'like_new'],
                ['title' => 'Araba Farları', 'price' => 400, 'condition' => 'used'],
                ['title' => 'Araba Tekerleği', 'price' => 600, 'condition' => 'used'],
                ['title' => 'Araba Bagajı', 'price' => 1500, 'condition' => 'used'],
                ['title' => 'Araba Kapısı', 'price' => 2000, 'condition' => 'used'],
                ['title' => 'Araba Motoru', 'price' => 15000, 'condition' => 'used']
            ],
            'other' => [
                ['title' => 'Gitar', 'price' => 1200, 'condition' => 'used'],
                ['title' => 'Piyano', 'price' => 8000, 'condition' => 'used'],
                ['title' => 'Keman', 'price' => 1500, 'condition' => 'like_new'],
                ['title' => 'Saat', 'price' => 500, 'condition' => 'used'],
                ['title' => 'Çanta', 'price' => 300, 'condition' => 'like_new'],
                ['title' => 'Gözlük', 'price' => 400, 'condition' => 'used'],
                ['title' => 'Takı Seti', 'price' => 200, 'condition' => 'like_new'],
                ['title' => 'Oyuncak', 'price' => 100, 'condition' => 'used'],
                ['title' => 'Kitap Rafı', 'price' => 250, 'condition' => 'used'],
                ['title' => 'Dekoratif Obje', 'price' => 150, 'condition' => 'like_new']
            ]
        ];

        // Kullanıcı ve üniversite bilgileri
        $user = User::first();
        $university = University::first();

        if (!$user) {
            $this->command->error('Kullanıcı bulunamadı! Önce UserSeeder çalıştırın.');
            return;
        }

        if (!$university) {
            $this->command->error('Üniversite bulunamadı! Önce UniversitySeeder çalıştırın.');
            return;
        }

        foreach ($categories as $category => $products) {
            foreach ($products as $productData) {
                Product::create([
                    'user_id' => $user->id,
                    'university_id' => $university->id,
                    'title' => $productData['title'],
                    'description' => $this->generateDescription($productData['title'], $category),
                    'price' => $productData['price'],
                    'category' => $category,
                    'condition' => $productData['condition'],
                    'location' => 'Kampüs İçi',
                    'is_active' => true,
                    'images' => null, // Fotoğrafsız
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(1, 30))
                ]);
            }
        }

        $this->command->info('Her kategoriye 10\'ar ürün eklendi!');
    }

    private function generateDescription($title, $category): string
    {
        $descriptions = [
            'electronics' => 'Kaliteli elektronik ürün. Kampüs içi teslimat mümkün. Fiyatta pazarlık payı var.',
            'books' => 'Ders kitabı. İçinde notlar var. Kampüs içi teslimat yapılır.',
            'clothing' => 'Güzel kıyafet. Temiz ve bakımlı. Kampüs içi teslimat.',
            'sports' => 'Spor ekipmanı. İyi durumda. Kampüs içi teslimat mümkün.',
            'home' => 'Ev eşyası. Kullanışlı ve temiz. Kampüs içi teslimat.',
            'automotive' => 'Araç parçası. Kaliteli ürün. Kampüs içi teslimat.',
            'other' => 'Çeşitli ürün. İyi durumda. Kampüs içi teslimat yapılır.'
        ];

        return $descriptions[$category] ?? 'Kaliteli ürün. Kampüs içi teslimat mümkün.';
    }
}
