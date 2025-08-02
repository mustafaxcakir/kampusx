<?php

namespace App\Observers;

use App\Models\ProductQuestion;
use App\Services\NotificationService;

class ProductQuestionObserver
{
    /**
     * Handle the ProductQuestion "created" event.
     */
    public function created(ProductQuestion $productQuestion): void
    {
        // Kendi ilanına soru sormuşsa bildirim oluşturma
        if ($productQuestion->asked_by_user_id === $productQuestion->product->user_id) {
            return;
        }

        NotificationService::createQuestionNotification(
            $productQuestion->askedBy,
            $productQuestion->product,
            $productQuestion->question
        );
    }

    /**
     * Handle the ProductQuestion "updated" event.
     */
    public function updated(ProductQuestion $productQuestion): void
    {
        // Eğer cevap eklendiyse ve daha önce cevap yoksa bildirim oluştur
        if ($productQuestion->wasChanged('answer') && 
            $productQuestion->answer && 
            !$productQuestion->getOriginal('answer')) {
            
            NotificationService::createAnswerNotification(
                $productQuestion->product->user,
                $productQuestion->askedBy,
                $productQuestion->product,
                $productQuestion->question,
                $productQuestion->answer
            );
        }
    }

    /**
     * Handle the ProductQuestion "deleted" event.
     */
    public function deleted(ProductQuestion $productQuestion): void
    {
        //
    }

    /**
     * Handle the ProductQuestion "restored" event.
     */
    public function restored(ProductQuestion $productQuestion): void
    {
        //
    }

    /**
     * Handle the ProductQuestion "force deleted" event.
     */
    public function forceDeleted(ProductQuestion $productQuestion): void
    {
        //
    }
}
