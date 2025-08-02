<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function follow($unique_id)
    {
        $user = User::where('unique_id', $unique_id)->firstOrFail();
        
        // Kendini takip etmeye çalışıyorsa engelle
        if (Auth::user()->unique_id === $user->unique_id) {
            return response()->json([
                'success' => false,
                'message' => 'Kendinizi takip edemezsiniz.'
            ], 400);
        }

        // Zaten takip ediyorsa engelle
        if (Auth::user()->isFollowing($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Bu kullanıcıyı zaten takip ediyorsunuz.'
            ], 400);
        }

        // Takip et
        Follow::create([
            'follower_id' => Auth::id(),
            'following_id' => $user->id,
        ]);

        // Bildirim oluştur
        NotificationService::createFollowNotification(Auth::user(), $user);

        return response()->json([
            'success' => true,
            'message' => 'Kullanıcı takip edildi.',
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
        ]);
    }

    public function unfollow($unique_id)
    {
        $user = User::where('unique_id', $unique_id)->firstOrFail();
        
        // Takip etmiyorsa engelle
        if (!Auth::user()->isFollowing($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Bu kullanıcıyı takip etmiyorsunuz.'
            ], 400);
        }

        // Takibi bırak
        Follow::where('follower_id', Auth::id())
              ->where('following_id', $user->id)
              ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Takip bırakıldı.',
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
        ]);
    }

    public function toggleFollow($unique_id)
    {
        $user = User::where('unique_id', $unique_id)->firstOrFail();
        
        if (Auth::user()->unique_id === $user->unique_id) {
            return response()->json([
                'success' => false,
                'message' => 'Kendinizi takip edemezsiniz.'
            ], 400);
        }

        $isFollowing = Auth::user()->isFollowing($user);

        if ($isFollowing) {
            // Takibi bırak
            Follow::where('follower_id', Auth::id())
                  ->where('following_id', $user->id)
                  ->delete();
            
            $message = 'Takip bırakıldı.';
        } else {
            // Takip et
            Follow::create([
                'follower_id' => Auth::id(),
                'following_id' => $user->id,
            ]);
            
            // Bildirim oluştur
            NotificationService::createFollowNotification(Auth::user(), $user);
            
            $message = 'Kullanıcı takip edildi.';
        }

        $followersCount = $user->followers()->count();
        $followingCount = $user->following()->count();

        return response()->json([
            'success' => true,
            'message' => $message,
            'is_following' => !$isFollowing,
            'followers_count' => $followersCount,
            'following_count' => $followingCount,
        ]);
    }

    public function getFollowers($unique_id)
    {
        $user = User::where('unique_id', $unique_id)->firstOrFail();
        
        $followers = $user->followers()
            ->select('users.id', 'users.name', 'users.surname', 'users.unique_id', 'users.created_at')
            ->with('university:id,name')
            ->orderBy('users.name')
            ->get()
            ->map(function ($follower) {
                return [
                    'id' => $follower->id,
                    'name' => $follower->name,
                    'surname' => $follower->surname,
                    'unique_id' => $follower->unique_id,
                    'university_name' => $follower->university ? $follower->university->name : null,
                    'created_at' => $follower->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'followers' => $followers,
            'count' => $followers->count()
        ]);
    }

    public function getFollowing($unique_id)
    {
        $user = User::where('unique_id', $unique_id)->firstOrFail();
        
        $following = $user->following()
            ->select('users.id', 'users.name', 'users.surname', 'users.unique_id', 'users.created_at')
            ->with('university:id,name')
            ->orderBy('users.name')
            ->get()
            ->map(function ($following) {
                return [
                    'id' => $following->id,
                    'name' => $following->name,
                    'surname' => $following->surname,
                    'unique_id' => $following->unique_id,
                    'university_name' => $following->university ? $following->university->name : null,
                    'created_at' => $following->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'following' => $following,
            'count' => $following->count()
        ]);
    }
}
