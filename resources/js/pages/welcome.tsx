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
            <header className="bg-background shadow-sm border-b border-sidebar-border/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-2xl text-foreground">KampusX</span>
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
                                        className="border border-sidebar-border text-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent hover:border-sidebar-border/80 transition-colors duration-200"
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
            <nav className="bg-background border-b border-sidebar-border/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center overflow-x-auto py-3 scrollbar-hide">
                        <div className="flex items-center space-x-6 min-w-max">
                            <button className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                TÜM KATEGORİLER
                            </button>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Kitap
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Elektronik
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Giyim
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Spor
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Ev & Yaşam
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Takas
                            </Link>
                        </div>
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
                            <div className="bg-card rounded-lg p-4 shadow-lg border border-sidebar-border/70">
                                <div className="w-32 h-32 bg-muted rounded-lg mb-2"></div>
                                <p className="text-sm text-muted-foreground">Tertemiz, az kullanılmış</p>
                                <p className="text-sm font-medium text-card-foreground">MacBook Pro</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="py-8 bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Product Card 1 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <div className="absolute top-2 left-2">
                                    <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded font-medium">
                                        • ÖNE ÇIKAN
                                    </span>
                                </div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">Cüzdanım Güvende</span>
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">MacBook Pro M2 Garantili</h3>
                                <p className="text-2xl font-bold text-card-foreground mb-2">30.500 TL</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Beyoğlu, İstanbul</span>
                                    <span>BUGÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 2 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs text-blue-600 font-medium">Ücretsiz Kargo</span>
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">iPhone 16 Pro 128GB</h3>
                                <p className="text-2xl font-bold text-card-foreground mb-2">59.000 TL</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Kadıköy, İstanbul</span>
                                    <span>DÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 3 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-card-foreground mb-1">Matematik Ders Kitabı</h3>
                                <p className="text-2xl font-bold text-card-foreground mb-2">50 TL</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Beşiktaş, İstanbul</span>
                                    <span>3 GÜN ÖNCE</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 4 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-card-foreground mb-1">Bisiklet (Takaslık)</h3>
                                <p className="text-2xl font-bold text-blue-600 mb-2">Takas</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Şişli, İstanbul</span>
                                    <span>1 HAFTA ÖNCE</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 5 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-card-foreground mb-1">Kulaklık Sony WH-1000XM4</h3>
                                <p className="text-2xl font-bold text-card-foreground mb-2">1.200 TL</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Üsküdar, İstanbul</span>
                                    <span>BUGÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 6 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-card-foreground mb-1">Kampüs Kartı (Yüklü)</h3>
                                <p className="text-2xl font-bold text-card-foreground mb-2">200 TL</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Fatih, İstanbul</span>
                                    <span>DÜN</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 7 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-card-foreground mb-1">Spor Ayakkabı Nike</h3>
                                <p className="text-2xl font-bold text-card-foreground mb-2">350 TL</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Bakırköy, İstanbul</span>
                                    <span>2 GÜN ÖNCE</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 8 */}
                        <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-sidebar-border/70">
                            <div className="relative">
                                <div className="w-full h-48 bg-muted"></div>
                                <button className="absolute top-2 right-2 p-1 bg-card rounded-full shadow-sm border border-sidebar-border/70">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-card-foreground mb-1">Kitaplık (Montajlı)</h3>
                                <p className="text-2xl font-bold text-card-foreground mb-2">150 TL</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
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
