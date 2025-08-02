<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotificationsCount(),
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        NotificationService::markAsRead($notification);

        return back()->with('success', 'Bildirim okundu olarak işaretlendi');
    }

    public function markAllAsRead()
    {
        $user = auth()->user();
        NotificationService::markAllAsRead($user);

        return back()->with('success', 'Tüm bildirimler okundu olarak işaretlendi');
    }

    public function delete(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        NotificationService::deleteNotification($notification);

        return back()->with('success', 'Bildirim silindi');
    }

    public function getUnreadCount()
    {
        $user = auth()->user();
        return response()->json([
            'count' => $user->unreadNotificationsCount()
        ]);
    }

    public function deleteAll()
    {
        $user = auth()->user();
        NotificationService::deleteAllNotifications($user);

        return back()->with('success', 'Tüm bildirimler silindi');
    }
}
