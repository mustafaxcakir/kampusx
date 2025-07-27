import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Heart, Truck, Shield } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="KampusX - Kampüsüne Özel İkinci El ve Yardımlaşma Platformu">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            {/* HEADER */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-2xl text-gray-900">KampusX</span>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-[#075B5E] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#064A4D] transition-colors duration-200 shadow-sm"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-[#FF3F33] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E6392E] transition-colors duration-200 shadow-sm"
                                    >
                                        Üye Ol
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* CATEGORIES NAVIGATION */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-8 py-3">
                        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            TÜM KATEGORİLER
                        </button>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Kitap
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Elektronik
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Giyim
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Spor
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Ev & Yaşam
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Takas
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO BANNER */}
            <section className="bg-[#075B5E] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h1 className="text-3xl font-bold mb-2">
                                KampusX ile hızlı sat!
                            </h1>
                            <p className="text-xl mb-4">
                                İlanını öne çıkar, daha çok alıcıya ulaş.
                            </p>
                            <button className="bg-[#FF3F33] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#E6392E]">
                                Premium İlan Ver
                            </button>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white rounded-lg p-4 shadow-lg">
                                <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2"></div>
                                <p className="text-sm text-gray-600">Tertemiz, az kullanılmış</p>
                                <p className="text-sm font-medium">MacBook Pro</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Product Card 1 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <div className="absolute top-2 left-2">
                                    <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded font-medium">
                                        • ÖNE ÇIKAN
                                    </span>
                                </div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">Cüzdanım Güvende</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">MacBook Pro M2 Garantili</h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">30.500 TL</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Beyoğlu, İstanbul</span>
                                    <span>BUGÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 2 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs text-blue-600 font-medium">Ücretsiz Kargo</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">iPhone 16 Pro 128GB</h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">59.000 TL</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Kadıköy, İstanbul</span>
                                    <span>DÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 3 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">Matematik Ders Kitabı</h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">50 TL</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Beşiktaş, İstanbul</span>
                                    <span>3 GÜN ÖNCE</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 4 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">Bisiklet (Takaslık)</h3>
                                <p className="text-2xl font-bold text-blue-600 mb-2">Takas</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Şişli, İstanbul</span>
                                    <span>1 HAFTA ÖNCE</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 5 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">Kulaklık Sony WH-1000XM4</h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">1.200 TL</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Üsküdar, İstanbul</span>
                                    <span>BUGÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 6 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">Kampüs Kartı (Yüklü)</h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">200 TL</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Fatih, İstanbul</span>
                                    <span>DÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 7 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">Spor Ayakkabı Nike</h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">350 TL</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Bakırköy, İstanbul</span>
                                    <span>2 GÜN ÖNCE</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 8 */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200"></div>
                                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">Kitaplık (Montajlı)</h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">150 TL</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Maltepe, İstanbul</span>
                                    <span>1 HAFTA ÖNCE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <span className="font-bold text-xl">KampusX</span>
                        </div>
                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <Link href="#" className="text-gray-300 hover:text-white">
                                Hakkımızda
                            </Link>
                            <Link href="#" className="text-gray-300 hover:text-white">
                                İletişim
                            </Link>
                            <Link href="#" className="text-gray-300 hover:text-white">
                                Gizlilik
                            </Link>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2025 KampusX. Tüm hakları saklıdır.
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
