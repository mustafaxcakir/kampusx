<?php

namespace App\Services;

use App\Models\User;
use App\Models\Product;
use App\Models\Notification;

class NotificationService
{
    public static function createFollowNotification(User $follower, User $following)
    {
        return Notification::create([
            'user_id' => $following->id,
            'type' => 'follow',
            'message' => "{$follower->name} {$follower->surname} sizi takip etmeye başladı",
            'data' => [
                'follower_id' => $follower->id,
                'follower_name' => $follower->name,
                'follower_surname' => $follower->surname,
            ],
        ]);
    }

    public static function createFavoriteNotification(User $user, Product $product)
    {
        return Notification::create([
            'user_id' => $product->user_id,
            'type' => 'favorite',
            'message' => "{$user->name} {$user->surname} ilanınızı favorilere ekledi",
            'data' => [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_surname' => $user->surname,
                'product_id' => $product->id,
                'product_title' => $product->title,
            ],
        ]);
    }

    public static function createQuestionNotification(User $user, Product $product, $question)
    {
        return Notification::create([
            'user_id' => $product->user_id,
            'type' => 'question',
            'message' => "{$user->name} {$user->surname} ilanınıza soru sordu",
            'data' => [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_surname' => $user->surname,
                'product_id' => $product->id,
                'product_title' => $product->title,
                'question' => $question,
            ],
        ]);
    }

    public static function createAnswerNotification(User $seller, User $buyer, Product $product, $question, $answer)
    {
        return Notification::create([
            'user_id' => $buyer->id,
            'type' => 'answer',
            'message' => "{$seller->name} {$seller->surname} sorunuza cevap verdi",
            'data' => [
                'seller_id' => $seller->id,
                'seller_name' => $seller->name,
                'seller_surname' => $seller->surname,
                'product_id' => $product->id,
                'product_title' => $product->title,
                'question' => $question,
                'answer' => $answer,
            ],
        ]);
    }

    public static function markAsRead(Notification $notification)
    {
        return $notification->markAsRead();
    }

    public static function markAllAsRead(User $user)
    {
        return $user->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public static function deleteNotification(Notification $notification)
    {
        return $notification->delete();
    }
}
