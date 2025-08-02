import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, MapPin, ArrowLeft, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Footer from '@/components/footer';

interface CategoryPageProps {
    category: string;
    categoryName: string;
    products: any;
    allCategories: Record<string, string>;
}

export default function CategoryPage({ category, categoryName, products, allCategories }: CategoryPageProps) {
    const { auth } = usePage<SharedData>().props;
    const { universities } = usePage<{ universities: any[] }>().props;
    const [sortBy, setSortBy] = useState('latest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
    const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
            
            const target = event.target as Element;
            if (!target.closest('.university-dropdown')) {
                setShowUniversityDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatPrice = (price: number) => {
        const numPrice = Number(price);
        return numPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + ' ₺';
    };

    const sortOptions = [
        { value: 'latest', label: 'En Yeni' },
        { value: 'oldest', label: 'En Eski' },
        { value: 'price_low', label: 'Fiyat (Düşük → Yüksek)' },
        { value: 'price_high', label: 'Fiyat (Yüksek → Düşük)' }
    ];

    const getCurrentSortLabel = () => {
        const option = sortOptions.find(opt => opt.value === sortBy);
        return option ? option.label : 'Sıralama';
    };

    const getSelectedUniversityName = () => {
        if (selectedUniversity === null) return 'Tüm Üniversiteler';
        const university = universities?.find(u => u.id === selectedUniversity);
        return university?.name || 'Tüm Üniversiteler';
    };

    // Filtrelenmiş ürünleri hesapla
    const filteredProducts = products?.data?.filter((product: any) => {
        if (selectedUniversity === null) return true;
        return product.university_id === selectedUniversity;
    }) || [];

    const sortProducts = (products: any[]) => {
        if (!products) return [];
        
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case 'latest':
                return sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case 'oldest':
                return sortedProducts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            case 'price_low':
                return sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
            case 'price_high':
                return sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
            default:
                return sortedProducts;
        }
    };

    return (
        <>
            <Head title={`${categoryName} - KampusX`}>
                <meta name="description" content={`${categoryName} kategorisindeki ikinci el ürünler. Kampüs içi güvenli alışveriş.`} />
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
                                <div className="flex items-center space-x-3 md:space-x-4">
                                    <div className="hidden md:block">
                                        <span className="text-sm text-muted-foreground">Hoşgeldin,</span>
                                        <span className="text-sm font-medium text-foreground ml-1">
                                            {auth.user.name} {auth.user.surname}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-[#101828] text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#0D141F] transition-colors duration-200 shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('ilanver')}
                                        className="bg-blue-600 text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                    >
                                        İlan Ver
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 md:space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="bg-[#101828] text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-[#0D141F] transition-colors duration-200 shadow-sm"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <div className="relative inline-flex items-center justify-center gap-2 md:gap-4 group">
                                        <div
                                            className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg blur-lg filter group-hover:opacity-100 group-hover:duration-200"
                                        ></div>
                                        <Link
                                            href={route('register')}
                                            className="group relative inline-flex items-center justify-center text-xs md:text-sm rounded-lg bg-blue-600 px-3 md:px-6 py-2 md:py-2.5 font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-600/30"
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

            {/* Category Title */}
            <section className="bg-muted/30 border-b border-sidebar-border/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground mb-1">{categoryName}</h1>
                                <p className="text-sm text-muted-foreground">
                                    {products.total} ürün bulundu
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Sort Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                                        className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-sidebar-border/70 hover:bg-accent transition-colors duration-200 text-sm"
                                    >
                                        <span>{getCurrentSortLabel()}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {showSortDropdown && (
                                        <div className="absolute right-0 top-full mt-1 bg-card border border-sidebar-border/70 rounded-lg shadow-lg z-10 min-w-48">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setShowSortDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors duration-200 ${
                                                        sortBy === option.value 
                                                            ? 'bg-primary text-primary-foreground' 
                                                            : 'text-card-foreground'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredProducts && filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                {sortProducts(filteredProducts).map((product: any) => (
                                    <Link 
                                        key={product.id} 
                                        href={route('product.show', { id: product.id })}
                                        className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col block"
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
                            
                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex items-center space-x-2">
                                        {products.links.map((link: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 rounded-md text-sm ${
                                                    link.active 
                                                        ? 'bg-primary text-primary-foreground' 
                                                        : 'bg-card text-card-foreground hover:bg-accent border border-sidebar-border/70'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-card rounded-lg p-8 border border-sidebar-border/70">
                                <h3 className="text-lg font-medium text-card-foreground mb-2">
                                    {selectedUniversity ? 'Seçilen üniversitede ürün bulunamadı' : 'Bu kategoride henüz ürün yok'}
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