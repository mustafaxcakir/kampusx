import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Heart, MapPin, Calendar, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Favorilerim',
        href: '/favorilerim',
    },
];

export default function Favorilerim() {
    const { favorites } = usePage<{ favorites: any[] }>().props;
    const [loading, setLoading] = useState(true);
    
    const removeForm = useForm({});

    // Loading state'ini yönet
    useEffect(() => {
        if (favorites !== undefined) {
            setLoading(false);
        }
    }, [favorites]);

    const formatPrice = (price: number) => {
        const numPrice = Number(price);
        return numPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + ' ₺';
    };

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

    const removeFromFavorites = (productId: number) => {
        removeForm.delete(`/products/${productId}/favorite`, {
            onSuccess: () => {
                // Sayfayı yenile
                window.location.reload();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Favorilerim" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-card-foreground">Favorilerim</h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-muted-foreground">Favorileriniz yükleniyor...</p>
                    </div>
                ) : favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {favorites.map((product) => (
                            <div key={product.id} className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-4 flex-1 flex flex-col gap-2">
                                    <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                                        {product.images && product.images.length > 0 ? (
                                            <>
                                                <img
                                                    src={"/storage/" + product.images[0]}
                                                    alt={product.title}
                                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const fallback = target.parentElement?.querySelector('.image-fallback');
                                                        if (fallback) {
                                                            fallback.classList.remove('hidden');
                                                        }
                                                    }}
                                                />
                                                <div className="image-fallback hidden absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                    <span className="text-gray-400 text-xs">Fotoğraf yüklenemedi</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">Fotoğraf yok</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <Link href={`/urun/${product.id}`} className="flex-1">
                                            <h3 className="font-semibold text-card-foreground line-clamp-2 hover:text-primary transition-colors truncate text-base">
                                                {product.title}
                                            </h3>
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFromFavorites(product.id);
                                            }}
                                            disabled={removeForm.processing}
                                            className="flex-shrink-0 ml-2 p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                        >
                                            <Heart className="w-4 h-4 fill-current" />
                                        </button>
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium text-card-foreground mb-2">Henüz favori ürününüz yok</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Beğendiğiniz ürünleri favorilerinize ekleyerek daha sonra kolayca bulabilirsiniz.
                        </p>
                        <Link
                            href="/"
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Ürünleri Keşfet
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
