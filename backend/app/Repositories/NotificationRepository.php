<?php

namespace App\Repositories;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationRepository
{
    public function createNotification($userId, $message)
    {
        return Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'is_read' => false,
        ]);
    }

    public function getUserNotifications($userId)
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', 0)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getUnreadNotificationCount($userId)
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', 0)
            ->count();
    }

    public function markAsRead($notificationId)
    {
        $notification = Notification::find($notificationId);
        if ($notification) {
            $notification->update(['is_read' => true]);
        }
    }
}
