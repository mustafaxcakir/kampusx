import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Truck, Shield, MapPin, Calendar, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '@/components/footer';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { products, universities } = usePage<{ products: any[], universities: any[] }>().props;
    const [loading, setLoading] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(10);
    const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
    const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);

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

    // Üniversite seçimi değiştiğinde visible products'ı sıfırla
    useEffect(() => {
        setVisibleProducts(10);
    }, [selectedUniversity]);

    // Dropdown dışına tıklandığında kapat
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.university-dropdown')) {
                setShowUniversityDropdown(false);
            }
        };

        if (showUniversityDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUniversityDropdown]);

    // Filtrelenmiş ürünleri hesapla
    const filteredProducts = products?.filter(product => {
        if (selectedUniversity === null) return true;
        return product.university_id === selectedUniversity;
    }) || [];

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

    const getSelectedUniversityName = () => {
        if (selectedUniversity === null) return 'Tüm Üniversiteler';
        const university = universities?.find(u => u.id === selectedUniversity);
        return university?.name || 'Tüm Üniversiteler';
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
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-[#101828] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0D141F] transition-colors duration-200 shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('ilanver')}
                                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                    >
                                        İlan Ver
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="bg-[#101828] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0D141F] transition-colors duration-200 shadow-sm"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <div className="relative inline-flex items-center justify-center gap-4 group">
                                        <div
                                            className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg blur-lg filter group-hover:opacity-100 group-hover:duration-200"
                                        ></div>
                                        <Link
                                            href={route('register')}
                                            className="group relative inline-flex items-center justify-center text-sm rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-600/30"
                                        >
                                            Üye Ol
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* CATEGORIES NAVIGATION */}
            <nav className="bg-background border-b border-sidebar-border/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between py-3">
                        <div className="flex items-center space-x-6">
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
                        
                        {/* Desktop University Filter */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-muted-foreground">Üniversite:</span>
                            <div className="relative university-dropdown">
                                <button
                                    onClick={() => setShowUniversityDropdown(!showUniversityDropdown)}
                                    className="flex items-center space-x-2 bg-white border border-sidebar-border/70 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors duration-200 min-w-[180px] justify-between"
                                >
                                    <span className="truncate">{getSelectedUniversityName()}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUniversityDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showUniversityDropdown && (
                                    <div className="absolute top-full right-0 mt-1 w-full bg-white border border-sidebar-border/70 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedUniversity(null);
                                                setShowUniversityDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors duration-200 ${selectedUniversity === null ? 'bg-accent text-foreground' : 'text-foreground'}`}
                                        >
                                            Tüm Üniversiteler
                                        </button>
                                        {universities?.map((university) => (
                                            <button
                                                key={university.id}
                                                onClick={() => {
                                                    setSelectedUniversity(university.id);
                                                    setShowUniversityDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors duration-200 ${selectedUniversity === university.id ? 'bg-accent text-foreground' : 'text-foreground'}`}
                                            >
                                                {university.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                        {/* Mobile Categories */}
                        <div className="flex items-center overflow-x-auto py-3 scrollbar-hide">
                            <div className="flex items-center space-x-4 min-w-max">
                                <Link href={route('home')} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                    TÜM
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
                        
                        {/* Mobile University Filter */}
                        <div className="flex items-center justify-between py-2 border-t border-sidebar-border/30">
                            <span className="text-sm font-medium text-muted-foreground">Üniversite:</span>
                            <div className="relative university-dropdown">
                                <button
                                    onClick={() => setShowUniversityDropdown(!showUniversityDropdown)}
                                    className="flex items-center space-x-2 bg-white border border-sidebar-border/70 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors duration-200 min-w-[140px] justify-between"
                                >
                                    <span className="truncate text-xs">{getSelectedUniversityName()}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showUniversityDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showUniversityDropdown && (
                                    <div className="absolute top-full right-0 mt-1 w-full bg-white border border-sidebar-border/70 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedUniversity(null);
                                                setShowUniversityDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors duration-200 ${selectedUniversity === null ? 'bg-accent text-foreground' : 'text-foreground'}`}
                                        >
                                            Tüm Üniversiteler
                                        </button>
                                        {universities?.map((university) => (
                                            <button
                                                key={university.id}
                                                onClick={() => {
                                                    setSelectedUniversity(university.id);
                                                    setShowUniversityDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors duration-200 ${selectedUniversity === university.id ? 'bg-accent text-foreground' : 'text-foreground'}`}
                                            >
                                                {university.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO BANNER */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#389df0] rounded-lg text-white py-12 px-6">
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
                    ) : filteredProducts && filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                {[...filteredProducts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, visibleProducts).map((product) => (
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
                            {visibleProducts < filteredProducts.length && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => setVisibleProducts(prev => Math.min(prev + 10, filteredProducts.length))}
                                        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 shadow-sm"
                                    >
                                        Daha Fazla Ürün Göster ({Math.min(10, filteredProducts.length - visibleProducts)} ürün daha)
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-card rounded-lg p-8 border border-sidebar-border/70">
                                <h3 className="text-lg font-medium text-card-foreground mb-2">
                                    {selectedUniversity ? 'Seçilen üniversitede ürün bulunamadı' : 'Henüz ürün yok'}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {selectedUniversity ? 'Farklı bir üniversite seçin veya tüm üniversiteleri görüntüleyin.' : 'İlk ürünü siz ekleyin!'}
                                </p>
                                {auth.user ? (
                                    <Link
                                        href={route('ilanver')}
                                        className="bg-[#101828] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0D141F] transition-colors duration-200 inline-block"
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
