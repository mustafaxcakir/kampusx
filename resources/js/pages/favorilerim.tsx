import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
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

    const formatPrice = (price: number) => {
        return Number(price) % 1 === 0 
            ? Number(price).toFixed(0) + ' ₺'
            : Number(price).toFixed(2) + ' ₺';
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Favorilerim" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-card-foreground">Favorilerim</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span>{favorites?.length || 0} ürün</span>
                    </div>
                </div>

                {favorites && favorites.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {favorites.map((product) => (
                            <div key={product.id} className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 overflow-hidden hover:shadow-md transition-shadow">
                                <Link href={route('product.show', { id: product.id })}>
                                    <div className="aspect-square overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <img 
                                                src={`/storage/${product.images[0]}`}
                                                alt={product.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <span className="text-muted-foreground text-sm">Fotoğraf Yok</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                
                                <div className="p-4">
                                    <Link href={route('product.show', { id: product.id })}>
                                        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                                            {product.title}
                                        </h3>
                                    </Link>
                                    
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {getCategoryText(product.category)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <User className="w-3 h-3" />
                                        <span>{product.user.name} {product.user.surname}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(product.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        {product.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{product.location}</span>
                                            </div>
                                        )}
                                    </div>
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
