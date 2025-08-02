import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, Users, MessageSquare, Plus, ClipboardList, Calendar, MapPin } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats: {
        active_products: number;
        total_favorites: number;
        followers_count: number;
        unanswered_questions: number;
    };
    recentNotifications: any[];
    recentProducts: any[];
    popularProducts: any[];
}

export default function Dashboard({ stats, recentNotifications, recentProducts, popularProducts }: Props) {
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'follow':
                return <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">T</span>
                </div>;
            case 'favorite':
                return <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-sm">♥</span>
                </div>;
            case 'question':
                return <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">?</span>
                </div>;
            case 'answer':
                return <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                </div>;
            default:
                return <Bell className="w-5 h-5" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Az önce';
        if (diffInHours < 24) return `${diffInHours} saat önce`;
        if (diffInHours < 48) return '1 gün önce';
        return `${Math.floor(diffInHours / 24)} gün önce`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* İstatistik Kartları */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktif İlanlar</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_products}</div>
                            <p className="text-xs text-muted-foreground">
                                Aktif ilanlarınız
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Toplam Favori</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_favorites}</div>
                            <p className="text-xs text-muted-foreground">
                                İlanlarınızın aldığı favori
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Takipçiler</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.followers_count}</div>
                            <p className="text-xs text-muted-foreground">
                                Sizi takip edenler
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cevaplanmamış Sorular</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unanswered_questions}</div>
                            <p className="text-xs text-muted-foreground">
                                Yanıt bekleyen sorular
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Hızlı Eylemler */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Hızlı Eylemler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/ilanver">
                                <Button className="w-full justify-start" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Yeni İlan Ver
                                </Button>
                            </Link>
                            <Link href="/favorilerim">
                                <Button className="w-full justify-start" variant="outline">
                                    <Heart className="mr-2 h-4 w-4" />
                                    Favorilerim
                                </Button>
                            </Link>
                            <Link href="/ilanlarim">
                                <Button className="w-full justify-start" variant="outline">
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    İlanlarım
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Bildirimler */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                                Son Bildirimler
                                <Link href="/bildirimler">
                                    <Button variant="ghost" size="sm">
                                        Tümünü Gör
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentNotifications.length === 0 ? (
                                    <div className="text-center py-4">
                                        <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Henüz bildiriminiz yok</p>
                                    </div>
                                ) : (
                                    recentNotifications.map((notification) => (
                                        <div key={notification.id} className={`flex items-center gap-3 p-3 rounded-lg ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                                            {getNotificationIcon(notification.type)}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</p>
                                            </div>
                                            {!notification.is_read && (
                                                <Badge variant="secondary" className="text-xs">Yeni</Badge>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Son Aktiviteler */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Son İlanlarınız</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentProducts.length === 0 ? (
                                    <div className="text-center py-4">
                                        <ClipboardList className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Henüz ilanınız yok</p>
                                        <Link href="/ilanver">
                                            <Button variant="outline" size="sm" className="mt-2">
                                                İlk İlanınızı Verin
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    recentProducts.map((product) => (
                                        <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{product.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {product.university?.name} • {formatDate(product.updated_at)}
                                                </p>
                                            </div>
                                            <Badge variant={product.is_active ? "default" : "secondary"}>
                                                {product.is_active ? "Aktif" : "Pasif"}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alt Kısım */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Popüler İlanlar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {popularProducts.length === 0 ? (
                                    <div className="text-center py-4">
                                        <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Henüz popüler ilan yok</p>
                                    </div>
                                ) : (
                                    popularProducts.map((product) => (
                                        <Link key={product.id} href={`/urun/${product.id}`}>
                                            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                                                <div>
                                                    <p className="font-medium">{product.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.university?.name} • {product.favorites_count} favori
                                                    </p>
                                                </div>
                                                <Badge variant="outline">
                                                    {new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY'
                                                    }).format(product.price)}
                                                </Badge>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Hızlı İstatistikler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-red-500" />
                                        <span className="text-sm">Toplam Favori</span>
                                    </div>
                                    <span className="font-semibold">{stats.total_favorites}</span>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm">Takipçiler</span>
                                    </div>
                                    <span className="font-semibold">{stats.followers_count}</span>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">Cevaplanmamış Sorular</span>
                                    </div>
                                    <span className="font-semibold">{stats.unanswered_questions}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
