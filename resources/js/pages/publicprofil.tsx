import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Heart, Truck, Shield, MapPin, Calendar, User, Mail, MoreVertical, Star, Users, GraduationCap, Eye, Plus, Edit, Trash2, Phone, Globe, Lock, Users as UsersIcon, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '@/components/footer';

export default function PublicProfile() {
    const { auth } = usePage<SharedData>().props;
    const { user, ads } = usePage<{ user: any; ads: any[] }>().props;
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'sold'>('all');
    const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [visibleListings, setVisibleListings] = useState(10);
    
    const formatPrice = (price: number) => {
        const numPrice = Number(price);
        return numPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + ' ₺';
    };
    
    // Gerçek ürünleri kullan
    const listings = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        price: formatPrice(ad.price),
        status: ad.is_active ? "Satılıyor" : "Satıldı",
        image: ad.images && ad.images.length > 0 ? `/storage/${ad.images[0]}` : null,
        daysAgo: Math.ceil((Date.now() - new Date(ad.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        university: ad.university,
    }));

    const filteredListings = listings.filter((listing) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "active") return listing.status === "Satılıyor";
        if (activeFilter === "sold") return listing.status === "Satıldı";
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Satılıyor":
                return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
            case "Satıldı":
                return "bg-muted text-muted-foreground";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    // Gizlilik ikonunu render eder
    // Loading state'ini yönet
    useEffect(() => {
        if (ads !== undefined) {
            setLoading(false);
        }
    }, [ads]);

    // Intersection Observer ile görünür resimleri takip et
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const newVisibleImages = new Set(visibleImages);
                let hasChanges = false;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const productId = parseInt(entry.target.getAttribute('data-product-id') || '0');
                        if (!newVisibleImages.has(productId)) {
                            newVisibleImages.add(productId);
                            hasChanges = true;
                        }
                    }
                });

                if (hasChanges) {
                    setVisibleImages(newVisibleImages);
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '200px' // Daha fazla önceden yükle
            }
        );

        // Tüm ürün kartlarını gözlemle
        const cards = document.querySelectorAll('[data-product-id]');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [filteredListings, visibleImages]);

    const getPrivacyIcon = (privacy: string) => {
        switch (privacy) {
            case 'public':
                return <Globe className="w-4 h-4 text-green-600" />;
            case 'members':
                return <UsersIcon className="w-4 h-4 text-blue-600" />;
            case 'private':
                return <Lock className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    return (
        <>
            <Head title={`${user.name} ${user.surname} - KampusX Profil`}>
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
                                    className="bg-[#101828] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0D141F] transition-colors duration-200 shadow-sm"
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

            {/* MAIN CONTENT */}
            <div className="min-h-screen bg-muted/50">
                <div className="max-w-6xl mx-auto p-4 space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-card rounded-lg shadow-sm border border-sidebar-border/70">
                        <div className="p-6">

                            
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Profile Photo */}
                                <div className="flex flex-col items-center lg:items-start">
                                    <div className="w-24 h-24 lg:w-28 lg:h-28 bg-[#101828] rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                                        <span className="text-white font-bold text-2xl lg:text-3xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Name and Info */}
                                <div className="flex-1">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-4">
                                        {user.name} {user.surname}
                                    </h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="w-4 h-4 flex-shrink-0" />
                                            <span>@{user.unique_id}</span>
                                        </div>
                                        {user.university_name && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                                <span>{user.university_name}</span>
                                                {user.privacy_info && getPrivacyIcon(user.privacy_info.university_privacy)}
                                            </div>
                                        )}
                                        {user.email && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-4 h-4 flex-shrink-0" />
                                                <span>{user.email}</span>
                                                {user.privacy_info && getPrivacyIcon(user.privacy_info.email_privacy)}
                                            </div>
                                        )}
                                        {user.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-4 h-4 flex-shrink-0" />
                                                <span>{user.phone}</span>
                                                {user.privacy_info && getPrivacyIcon(user.privacy_info.phone_privacy)}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            <span>Üye olma: {new Date(user.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section - Separate */}
                            {user.about && (
                                <div className="mt-6 pt-6 border-t border-sidebar-border/70">
                                    <h3 className="font-semibold text-lg mb-3 text-card-foreground">Hakkında</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {user.about.length > 300 ? user.about.substring(0, 300) + '...' : user.about}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Listings Section */}
                    <div className="bg-card rounded-lg shadow-sm border border-sidebar-border/70">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-card-foreground">İlanlar</h2>

                                {/* Filter Tabs */}
                                <div className="flex space-x-1 bg-muted rounded-lg p-1 overflow-x-auto">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                            activeFilter === 'all'
                                                ? 'bg-card text-card-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Tümü
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('active')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                            activeFilter === 'active'
                                                ? 'bg-card text-card-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('sold')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                            activeFilter === 'sold'
                                                ? 'bg-card text-card-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Satıldı
                                    </button>
                                </div>
                            </div>

                            {/* Listings Grid */}
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-muted-foreground">İlanlar yükleniyor...</p>
                                </div>
                            ) : filteredListings.length > 0 ? (
                                <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                    {filteredListings.slice(0, visibleListings).map((listing) => (
                                        <Link 
                                            key={listing.id} 
                                            href={route('product.show', { id: listing.id })}
                                            className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col block" 
                                            data-product-id={listing.id}
                                            style={{ willChange: 'transform' }}
                                        >
                                            <div className="p-4 flex-1 flex flex-col gap-2">
                                                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                                    {listing.image ? (
                                                        visibleImages.has(listing.id) ? (
                                                            <img
                                                                src={listing.image}
                                                                alt={listing.title}
                                                                className="object-cover w-full h-full"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                                <div className="w-4 h-4 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-gray-400 text-xs">Fotoğraf yok</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-semibold text-card-foreground line-clamp-2 truncate text-base flex-1">
                                                        {listing.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                                                        {listing.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="font-bold text-primary mt-auto">
                                                    {listing.price}
                                                </div>
                                                
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{listing.daysAgo} gün önce</span>
                                                </div>
                                                {listing.university?.name && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{listing.university.name}</span>
                                                    </div>
                                                )}
                                                {/* Sadece kendi profilinde düzenleme butonları göster */}
                                                {auth.user && auth.user.id === user.id && (
                                                    <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                                        <Link 
                                                            href={route('ilanlarim')}
                                                            className="flex-1 px-2 py-2 border border-sidebar-border rounded-md text-xs hover:bg-accent transition-colors text-foreground text-center"
                                                        >
                                                            <Edit className="w-3 h-3 mr-1 inline" />
                                                            Düzenle
                                                        </Link>
                                                        <Link 
                                                            href={route('ilanlarim')}
                                                            className="px-2 py-2 border border-sidebar-border rounded-md text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {visibleListings < filteredListings.length && (
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={() => setVisibleListings(prev => Math.min(prev + 10, filteredListings.length))}
                                            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 shadow-sm"
                                        >
                                            Daha Fazla İlan Göster ({Math.min(10, filteredListings.length - visibleListings)} ilan daha)
                                        </button>
                                    </div>
                                )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        {activeFilter === 'sold' ? (
                                            <CheckCircle className="h-12 w-12 text-muted-foreground" />
                                        ) : (
                                            <User className="h-12 w-12 text-muted-foreground" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                        {activeFilter === 'sold' ? 'Henüz satılan yok' : 'Henüz bir İlanın yok'}
                                    </h3>
                                    {activeFilter !== 'sold' && (
                                        <>
                                            <p className="text-muted-foreground mb-8">
                                                Artık kullanmadığın eşyaları elden çıkar
                                            </p>
                                            
                                            <Link
                                                href={route('ilanver')}
                                                className="bg-[#FF3F33] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#E6392E] transition-colors duration-200 inline-block"
                                            >
                                                Satmaya Başla
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
    