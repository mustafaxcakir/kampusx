import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';
import { Bell, Check, Trash2, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bildirimler',
        href: '/bildirimler',
    },
];

interface Notification {
    id: number;
    type: 'follow' | 'favorite' | 'question' | 'answer';
    message: string;
    data: any;
    is_read: boolean;
    created_at: string;
}

interface Props {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    unreadCount: number;
}

export default function Notifications({ notifications, unreadCount }: Props) {
    const markAsRead = (notificationId: number) => {
        router.post(`/bildirimler/${notificationId}/read`);
    };

    const markAllAsRead = () => {
        router.post('/bildirimler/read-all');
    };

    const deleteNotification = (notificationId: number) => {
        router.delete(`/bildirimler/${notificationId}`);
    };

    const deleteAllNotifications = () => {
        if (confirm('Tüm bildirimleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            router.delete('/bildirimler');
        }
    };

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

    const getNotificationLink = (notification: Notification) => {
        switch (notification.type) {
            case 'follow':
                return `/profil/${notification.data.follower_id}`;
            case 'favorite':
            case 'question':
            case 'answer':
                return `/urun/${notification.data.product_id}`;
            default:
                return '#';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bildirimler" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Bildirimler</h1>
                        <p className="text-muted-foreground">
                            {unreadCount} okunmamış bildirim
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button onClick={markAllAsRead} variant="outline" size="sm">
                                <Check className="w-4 h-4 mr-2" />
                                Tümünü Okundu İşaretle
                            </Button>
                        )}
                        
                        {notifications.data.length > 0 && (
                            <Button onClick={deleteAllNotifications} variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Tümünü Temizle
                            </Button>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    {notifications.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Henüz bildiriminiz yok</h3>
                                <p className="text-muted-foreground text-center">
                                    Yeni bildirimler geldiğinde burada görünecek
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        notifications.data.map((notification) => (
                            <Card key={notification.id} className={`transition-all ${!notification.is_read ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        {getNotificationIcon(notification.type)}
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(notification.created_at).toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {!notification.is_read && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Yeni
                                                        </Badge>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-1">
                                                        {!notification.is_read && (
                                                            <Button
                                                                onClick={() => markAsRead(notification.id)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        
                                                        <Button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                                                                         {(notification.type === 'favorite' || notification.type === 'question' || notification.type === 'answer') && (
                                                 <Link
                                                     href={getNotificationLink(notification)}
                                                     className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                 >
                                                     İlanı görüntüle →
                                                 </Link>
                                             )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === notifications.current_page ? "default" : "outline"}
                                size="sm"
                                onClick={() => router.get('/bildirimler', { page })}
                                className="w-8 h-8 p-0"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 