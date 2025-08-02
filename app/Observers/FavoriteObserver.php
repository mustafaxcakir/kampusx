<?php

namespace App\Observers;

use App\Models\Favorite;
use App\Services\NotificationService;

class FavoriteObserver
{
    /**
     * Handle the Favorite "created" event.
     */
    public function created(Favorite $favorite): void
    {
        // Kendi ilanını favorilere eklemişse bildirim oluşturma
        if ($favorite->user_id === $favorite->product->user_id) {
            return;
        }

        NotificationService::createFavoriteNotification(
            $favorite->user,
            $favorite->product
        );
    }

    /**
     * Handle the Favorite "updated" event.
     */
    public function updated(Favorite $favorite): void
    {
        //
    }

    /**
     * Handle the Favorite "deleted" event.
     */
    public function deleted(Favorite $favorite): void
    {
        //
    }

    /**
     * Handle the Favorite "restored" event.
     */
    public function restored(Favorite $favorite): void
    {
        //
    }

    /**
     * Handle the Favorite "force deleted" event.
     */
    public function forceDeleted(Favorite $favorite): void
    {
        //
    }
}
