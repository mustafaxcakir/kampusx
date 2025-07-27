import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Heart, Truck, Shield, MapPin, Calendar, User, Mail, MoreVertical, Star, Users, GraduationCap, Eye, Plus, Edit, Trash2, Phone, Globe, Lock, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';

export default function PublicProfile() {
    const { auth } = usePage<SharedData>().props;
    const { user, ads } = usePage<{ user: any; ads: any[] }>().props;
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'sold' | 'rental'>('all');
    
    // Mock listings for now (will be replaced with real ads)
    const listings = [
        {
            id: 1,
            title: 'MacBook Pro 13" 2020',
            price: "25,000 TL",
            status: "Satılıyor",
            image: "/placeholder.svg?height=200&width=300",
            category: "Elektronik",
            date: "2 gün önce",
        },
        {
            id: 2,
            title: "Calculus Kitabı - Stewart",
            price: "150 TL",
            status: "Satıldı",
            image: "/placeholder.svg?height=200&width=300",
            category: "Kitap",
            date: "1 hafta önce",
        },
        {
            id: 3,
            title: 'Bisiklet - Trek 26"',
            price: "2,500 TL",
            status: "Kiralık",
            image: "/placeholder.svg?height=200&width=300",
            category: "Spor",
            date: "3 gün önce",
        },
    ];

    const filteredListings = listings.filter((listing) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "active") return listing.status === "Satılıyor" || listing.status === "Kiralık";
        if (activeFilter === "sold") return listing.status === "Satıldı";
        if (activeFilter === "rental") return listing.status === "Kiralık";
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Satılıyor":
                return "bg-green-100 text-green-800";
            case "Satıldı":
                return "bg-gray-100 text-gray-800";
            case "Kiralık":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Gizlilik ikonunu render eder
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
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="font-bold text-2xl text-gray-900 hover:text-gray-700">
                                KampusX
                            </Link>
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

            {/* MAIN CONTENT */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto p-4 space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">

                            
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Profile Photo */}
                                <div className="flex flex-col items-center lg:items-start">
                                    <div className="w-24 h-24 lg:w-28 lg:h-28 bg-[#075B5E] rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                                        <span className="text-white font-bold text-2xl lg:text-3xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Name and Info */}
                                <div className="flex-1">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                        {user.name} {user.surname}
                                    </h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-4 h-4 flex-shrink-0" />
                                            <span>@{user.unique_id}</span>
                                        </div>
                                        {user.university_name && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                                <span>{user.university_name}</span>
                                                {user.privacy_info && getPrivacyIcon(user.privacy_info.university_privacy)}
                                            </div>
                                        )}
                                        {user.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 flex-shrink-0" />
                                                <span>{user.email}</span>
                                                {user.privacy_info && getPrivacyIcon(user.privacy_info.email_privacy)}
                                            </div>
                                        )}
                                        {user.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 flex-shrink-0" />
                                                <span>{user.phone}</span>
                                                {user.privacy_info && getPrivacyIcon(user.privacy_info.phone_privacy)}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            <span>Üye olma: {new Date(user.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section - Separate */}
                            {user.about && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Hakkında</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {user.about.length > 300 ? user.about.substring(0, 300) + '...' : user.about}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Listings Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">İlanlar</h2>

                                {/* Filter Tabs */}
                                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                            activeFilter === 'all'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Tümü
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('active')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                            activeFilter === 'active'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('sold')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                            activeFilter === 'sold'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Satıldı
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('rental')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                            activeFilter === 'rental'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Kiralık
                                    </button>
                                </div>
                            </div>

                            {/* Listings Grid */}
                            {filteredListings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredListings.map((listing) => (
                                        <div key={listing.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="relative">
                                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">Resim</span>
                                                </div>
                                                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                                                    {listing.status}
                                                </span>
                                            </div>

                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                                                <p className="text-2xl font-bold text-green-600 mb-2">{listing.price}</p>
                                                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                                                    <span>{listing.category}</span>
                                                    <span>{listing.date}</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                                        <Edit className="w-4 h-4 mr-1 inline" />
                                                        Düzenle
                                                    </button>
                                                    <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Henüz bir İlanın yok
                                    </h3>
                                    <p className="text-gray-600 mb-8">
                                        Artık kullanmadığın eşyaları elden çıkar
                                    </p>
                                    
                                    <Link
                                        href={route('ilanver')}
                                        className="bg-[#FF3F33] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#E6392E] transition-colors duration-200 inline-block"
                                    >
                                        Satmaya Başla
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
                        {/* POPÜLER KATEGORİLER */}
                        <div>
                            <h4 className="font-semibold mb-4">POPÜLER KATEGORİLER</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><Link href="#" className="hover:text-white">İkinci El Cep Telefonu</Link></li>
                                <li><Link href="#" className="hover:text-white">İkinci El Bilgisayar</Link></li>
                                <li><Link href="#" className="hover:text-white">İkinci El Araba</Link></li>
                                <li><Link href="#" className="hover:text-white">İkinci El Motosiklet</Link></li>
                            </ul>
                        </div>

                        {/* POPÜLER SAYFALAR */}
                        <div>
                            <h4 className="font-semibold mb-4">POPÜLER SAYFALAR</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><Link href="#" className="hover:text-white">İkinci El Mobilya</Link></li>
                                <li><Link href="#" className="hover:text-white">İkinci El Bisiklet</Link></li>
                                <li><Link href="#" className="hover:text-white">İkinci El Bebek Arabası</Link></li>
                                <li><Link href="#" className="hover:text-white">İkinci El Kask</Link></li>
                            </ul>
                        </div>

                        {/* KAMPUSX */}
                        <div>
                            <h4 className="font-semibold mb-4">KAMPUSX</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><Link href="#" className="hover:text-white">Hakkımızda</Link></li>
                                <li><Link href="#" className="hover:text-white">Yardım Ve Destek</Link></li>
                                <li><Link href="#" className="hover:text-white">Güvenlik Önerileri</Link></li>
                                <li><Link href="#" className="hover:text-white">İletişim</Link></li>
                            </ul>
                        </div>

                        {/* BİZİ TAKİP ET */}
                        <div>
                            <h4 className="font-semibold mb-4">BİZİ TAKİP ET</h4>
                            <div className="flex space-x-4 mb-4">
                                <Link href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                                    <span className="text-xs">f</span>
                                </Link>
                                <Link href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                                    <span className="text-xs">t</span>
                                </Link>
                                <Link href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                                    <span className="text-xs">i</span>
                                </Link>
                                <Link href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                                    <span className="text-xs">y</span>
                                </Link>
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-24 h-8 bg-gray-700 rounded"></div>
                                <div className="w-24 h-8 bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex space-x-6 text-sm text-gray-400 mb-4 md:mb-0">
                                <Link href="#" className="hover:text-white">Şartlar ve Koşullar</Link>
                                <Link href="#" className="hover:text-white">Reklam Politikası</Link>
                                <Link href="#" className="hover:text-white">Gizlilik Bildirimi</Link>
                            </div>
                            <div className="text-sm text-gray-400">
                                Türkiye'de ikinci el eşya al ve sat. © 2006-2025 KampusX
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
    