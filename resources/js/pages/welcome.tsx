import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Truck, Shield, MapPin, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '@/components/footer';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { products } = usePage<{ products: any[] }>().props;
    const [loading, setLoading] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(10);

    const formatPrice = (price: number) => {
        const numPrice = Number(price);
        return numPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + ' ₺';
    };

    // Loading state'ini yönet
    useEffect(() => {
        if (products !== undefined) {
            setLoading(false);
        }
    }, [products]);







    const getCategoryText = (category: string) => {
        const categories: { [key: string]: string } = {
            'electronics': 'Elektronik',
            'books': 'Kitap',
            'clothing': 'Giyim',
            'sports': 'Spor',
            'home': 'Ev & Yaşam',
            'automotive': 'Otomotiv',
            'other': 'Diğer'
        };
        return categories[category] || category;
    };

    const getConditionText = (condition: string) => {
        const conditions: { [key: string]: string } = {
            'new': 'Yeni',
            'like_new': 'Az Kullanılmış',
            'used': 'Kullanılmış'
        };
        return conditions[condition] || condition;
    };



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
                        <Link href={route('home')} className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                            <span className="font-bold text-2xl text-foreground">KampusX</span>
                        </Link>

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
                            <Link href={route('home')} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                TÜM KATEGORİLER
                            </Link>
                            <Link href={route('category.show', { category: 'books' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Kitap
                            </Link>
                            <Link href={route('category.show', { category: 'electronics' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Elektronik
                            </Link>
                            <Link href={route('category.show', { category: 'clothing' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Giyim
                            </Link>
                            <Link href={route('category.show', { category: 'sports' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Spor
                            </Link>
                            <Link href={route('category.show', { category: 'home' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Ev & Yaşam
                            </Link>
                            <Link href={route('category.show', { category: 'other' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Diğer
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO BANNER */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#075B5E] rounded-lg text-white py-12 px-6">
                        <h1 className="text-3xl font-bold mb-2">
                            Aynı Kampüs, Aynı İhtiyaç, Yeni Sahibini Bul!
                        </h1>
                        <p className="text-xl mb-4">
                            Öğrenciden Öğrenciye Güvenli Alışveriş
                        </p>
                    </div>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-muted-foreground">Ürünler yükleniyor...</p>
                        </div>
                    ) : products && products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                {[...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, visibleProducts).map((product) => (
                                <Link 
                                    key={product.id} 
                                    href={route('product.show', { id: product.id })}
                                    className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col block" 
                                    style={{ willChange: 'transform' }}
                                >
                                    <div className="p-4 flex-1 flex flex-col gap-2">
                                                                                            <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={`/storage/${product.images[0]}`}
                                                                alt={product.title}
                                                                className="object-contain w-full h-full"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="text-gray-400 text-xs">Fotoğraf yok</span>
                                                            </div>
                                                        )}
                                                    </div>
                                        
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-card-foreground line-clamp-2 truncate text-base flex-1">
                                                {product.title}
                                            </h3>
                                        </div>
                                        
                                        <div className="font-bold text-primary mt-auto">
                                            {formatPrice(product.price)}
                                        </div>
                                        
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>{Math.ceil((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24))} gün önce</span>
                                        </div>
                                        {product.university?.name && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                <span>{product.university.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                            </div>
                            
                            {/* Daha Fazla Ürün Butonu */}
                            {visibleProducts < products.length && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => setVisibleProducts(prev => Math.min(prev + 10, products.length))}
                                        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 shadow-sm"
                                    >
                                        Daha Fazla Ürün Göster ({Math.min(10, products.length - visibleProducts)} ürün daha)
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-card rounded-lg p-8 border border-sidebar-border/70">
                                <h3 className="text-lg font-medium text-card-foreground mb-2">Henüz ürün yok</h3>
                                <p className="text-muted-foreground mb-4">İlk ürünü siz ekleyin!</p>
                                {auth.user ? (
                                    <Link
                                        href={route('ilanver')}
                                        className="bg-[#075B5E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#064A4D] transition-colors duration-200 inline-block"
                                    >
                                        İlan Ver
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('register')}
                                        className="bg-[#FF3F33] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#E6392E] transition-colors duration-200 inline-block"
                                    >
                                        Üye Ol ve İlan Ver
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
