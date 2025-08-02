import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';
import { Bell, Check, Trash2, Eye, User, Heart, HelpCircle } from 'lucide-react';

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
                return <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-white" />
                </div>;
            case 'favorite':
                return <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Heart className="w-5 h-5 text-white fill-current" />
                </div>;
            case 'question':
                return <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <HelpCircle className="w-5 h-5 text-white" />
                </div>;
            case 'answer':
                return <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Check className="w-5 h-5 text-white" />
                </div>;
            default:
                return <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Bell className="w-5 h-5 text-white" />
                </div>;
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
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bildirimler</h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button onClick={markAllAsRead} variant="outline" size="sm" className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Check className="w-4 h-4 mr-2" />
                                Tümünü Okundu İşaretle
                            </Button>
                        )}
                        
                        {notifications.data.length > 0 && (
                            <Button onClick={deleteAllNotifications} variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Tümünü Temizle
                            </Button>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    {notifications.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mb-6">
                                <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Henüz bildiriminiz yok</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                                Yeni bildirimler geldiğinde burada görünecek. Takip ettiğiniz kişilerden ve ilanlarınızdan gelen güncellemeleri buradan takip edebilirsiniz.
                            </p>
                        </div>
                    ) : (
                        notifications.data.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`group relative p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                                    !notification.is_read 
                                        ? 'border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20' 
                                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50 hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                            >
                                {/* Unread indicator */}
                                {!notification.is_read && (
                                    <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                
                                <div className="flex items-start gap-4 pl-6">
                                    {getNotificationIcon(notification.type)}
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    {new Date(notification.created_at).toLocaleString('tr-TR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                
                                                {(notification.type === 'favorite' || notification.type === 'question' || notification.type === 'answer') && (
                                                    <Link
                                                        href={getNotificationLink(notification)}
                                                        className="inline-flex items-center mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                    >
                                                        İlanı görüntüle
                                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.is_read && (
                                                    <Button
                                                        onClick={() => markAsRead(notification.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/20"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                
                                                <Button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {notifications.total > 20 && (
                    <div className="flex items-center justify-between mt-8 px-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {notifications.total} bildirimden {(notifications.current_page - 1) * notifications.per_page + 1} - {Math.min(notifications.current_page * notifications.per_page, notifications.total)} arası gösteriliyor
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* Previous button */}
                            {notifications.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get('/bildirimler', { page: notifications.current_page - 1 })}
                                    className="flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Önceki
                                </Button>
                            )}
                            
                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {/* First page */}
                                {notifications.current_page > 3 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/bildirimler', { page: 1 })}
                                            className="w-8 h-8 p-0"
                                        >
                                            1
                                        </Button>
                                        {notifications.current_page > 4 && (
                                            <span className="text-gray-400 px-2">...</span>
                                        )}
                                    </>
                                )}
                                
                                {/* Current page and neighbors */}
                                {Array.from({ length: notifications.last_page }, (_, i) => i + 1)
                                    .filter(page => 
                                        page === 1 || 
                                        page === notifications.last_page || 
                                        Math.abs(page - notifications.current_page) <= 1
                                    )
                                    .map((page) => (
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
                                
                                {/* Last page */}
                                {notifications.current_page < notifications.last_page - 2 && (
                                    <>
                                        {notifications.current_page < notifications.last_page - 3 && (
                                            <span className="text-gray-400 px-2">...</span>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/bildirimler', { page: notifications.last_page })}
                                            className="w-8 h-8 p-0"
                                        >
                                            {notifications.last_page}
                                        </Button>
                                    </>
                                )}
                            </div>
                            
                            {/* Next button */}
                            {notifications.current_page < notifications.last_page && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get('/bildirimler', { page: notifications.current_page + 1 })}
                                    className="flex items-center gap-2"
                                >
                                    Sonraki
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 