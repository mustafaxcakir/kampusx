import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Heart, Truck, Shield, MapPin, Calendar, User, Mail, MoreVertical, Star, Users, GraduationCap, Eye, Plus, Edit, Trash2, Phone, Globe, Lock, Users as UsersIcon, CheckCircle, UserPlus, UserMinus, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '@/components/footer';

export default function PublicProfile() {
    const { auth } = usePage<SharedData>().props;
    const { user, ads } = usePage<{ user: any; ads: any[] }>().props;
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'sold'>('all');
    const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [visibleListings, setVisibleListings] = useState(10);
    const [isFollowing, setIsFollowing] = useState(user.is_following || false);
    const [followersCount, setFollowersCount] = useState(user.stats.followers || 0);
    const [followingCount, setFollowingCount] = useState(user.stats.following || 0);
    const [followLoading, setFollowLoading] = useState(false);
    
    // Popup state'leri
    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const [showFollowingPopup, setShowFollowingPopup] = useState(false);
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [followersLoading, setFollowersLoading] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
    const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
    
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

    const getSelectedUniversityName = () => {
        if (selectedUniversity === null) return 'Tüm Üniversiteler';
        const university = user.universities?.find((u: any) => u.id === selectedUniversity);
        return university?.name || 'Tüm Üniversiteler';
    };

    const handleToggleFollow = async () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        if (auth.user.unique_id === user.unique_id) {
            return; // Kendini takip edemez
        }

        setFollowLoading(true);
        
        try {
            const response = await fetch(route('toggle.follow', { unique_id: user.unique_id }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                setIsFollowing(data.is_following);
                setFollowersCount(data.followers_count);
                setFollowingCount(data.following_count);
            } else {
                console.error('Takip işlemi başarısız:', data.message);
            }
        } catch (error) {
            console.error('Takip işlemi hatası:', error);
        } finally {
            setFollowLoading(false);
        }
    };

    const handleShowFollowers = async () => {
        setShowFollowersPopup(true);
        setFollowersLoading(true);
        
        try {
            const response = await fetch(route('followers', { unique_id: user.unique_id }));
            const data = await response.json();
            
            if (data.success) {
                setFollowers(data.followers);
            }
        } catch (error) {
            console.error('Takipçiler yüklenirken hata:', error);
        } finally {
            setFollowersLoading(false);
        }
    };

    const handleShowFollowing = async () => {
        setShowFollowingPopup(true);
        setFollowingLoading(true);
        
        try {
            const response = await fetch(route('following', { unique_id: user.unique_id }));
            const data = await response.json();
            
            if (data.success) {
                setFollowing(data.following);
            }
        } catch (error) {
            console.error('Takip edilenler yüklenirken hata:', error);
        } finally {
            setFollowingLoading(false);
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
                                <div className="flex items-center space-x-3 md:space-x-4">
                                    <div className="hidden md:block">
                                        <span className="text-sm text-muted-foreground">Hoşgeldin,</span>
                                        <span className="text-sm font-medium text-foreground ml-1">
                                            {auth.user.name} {auth.user.surname}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-[#101828] dark:bg-gray-800 text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#0D141F] dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
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
                                        className="bg-[#101828] dark:bg-gray-800 text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-[#0D141F] dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
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
                        
                        {/* Desktop University Filter (Disabled) */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-muted-foreground">Üniversite:</span>
                            <div className="relative">
                                <button
                                    disabled
                                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 border border-sidebar-border/70 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed min-w-[180px] justify-between"
                                >
                                    <span className="truncate">Tüm Üniversiteler</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
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
                        
                        {/* Mobile University Filter (Disabled) */}
                        <div className="flex items-center justify-between py-2 border-t border-sidebar-border/30">
                            <span className="text-sm font-medium text-muted-foreground">Üniversite:</span>
                            <div className="relative">
                                <button
                                    disabled
                                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 border border-sidebar-border/70 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed min-w-[140px] justify-between"
                                >
                                    <span className="truncate text-xs">Tüm Üniversiteler</span>
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
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
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                        <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground">
                                            {user.name} {user.surname}
                                        </h1>
                                        
                                        <div className="flex items-center gap-4">
                                            {/* Takipçi İstatistikleri - Herkes görebilir */}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <button
                                                    onClick={handleShowFollowers}
                                                    className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                                                >
                                                    <Users className="w-4 h-4" />
                                                    <span>{followersCount} takipçi</span>
                                                </button>
                                                <button
                                                    onClick={handleShowFollowing}
                                                    className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    <span>{followingCount} takip</span>
                                                </button>
                                            </div>
                                            
                                            {/* Takip Butonu - Sadece başka kullanıcıların profilinde göster */}
                                            {auth.user && auth.user.unique_id !== user.unique_id && (
                                                <button
                                                    onClick={handleToggleFollow}
                                                    disabled={followLoading}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                                                        isFollowing
                                                            ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                    } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {followLoading ? (
                                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    ) : isFollowing ? (
                                                        <>
                                                            <UserMinus className="w-3 h-3" />
                                                            Takibi Bırak
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus className="w-3 h-3" />
                                                            Takip Et
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
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

            {/* Takipçiler Popup */}
            {showFollowersPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-sidebar-border/70">
                            <h3 className="text-lg font-semibold text-card-foreground">Takipçiler</h3>
                            <button
                                onClick={() => setShowFollowersPopup(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {followersLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : followers.length > 0 ? (
                                <div className="space-y-3">
                                    {followers.map((follower) => (
                                        <Link
                                            key={follower.id}
                                            href={route('public.profile', { unique_id: follower.unique_id })}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                                            onClick={() => setShowFollowersPopup(false)}
                                        >
                                            <div className="w-10 h-10 bg-[#101828] rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-sm">
                                                    {follower.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-card-foreground truncate">
                                                    {follower.name} {follower.surname}
                                                </div>
                                                {follower.university_name && (
                                                    <div className="text-sm text-muted-foreground truncate">
                                                        {follower.university_name}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Henüz takipçi yok
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Takip Edilenler Popup */}
            {showFollowingPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-sidebar-border/70">
                            <h3 className="text-lg font-semibold text-card-foreground">Takip Edilenler</h3>
                            <button
                                onClick={() => setShowFollowingPopup(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {followingLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : following.length > 0 ? (
                                <div className="space-y-3">
                                    {following.map((followed) => (
                                        <Link
                                            key={followed.id}
                                            href={route('public.profile', { unique_id: followed.unique_id })}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                                            onClick={() => setShowFollowingPopup(false)}
                                        >
                                            <div className="w-10 h-10 bg-[#101828] rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-sm">
                                                    {followed.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-card-foreground truncate">
                                                    {followed.name} {followed.surname}
                                                </div>
                                                {followed.university_name && (
                                                    <div className="text-sm text-muted-foreground truncate">
                                                        {followed.university_name}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Henüz kimseyi takip etmiyor
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
    