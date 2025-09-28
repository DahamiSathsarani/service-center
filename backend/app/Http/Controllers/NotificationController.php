<?php

namespace App\Http\Controllers;

use App\Repositories\NotificationRepository;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    protected $notificationRepository;

    public function __construct(NotificationRepository $notificationRepository)
    {
        $this->notificationRepository = $notificationRepository;
    }

    public function createNotification(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $userId = $request->user()->user_id;
        $message = $request->input('message');

        $notification = $this->notificationRepository->createNotification($userId, $message);

        return response()->json($notification, 201);
    }

    public function getUserNotifications(Request $request)
    {
        $userId = $request->user()->user_id;
        $notifications = $this->notificationRepository->getUserNotifications($userId);
        return response()->json($notifications);
    }

    public function getUnreadNotificationCount(Request $request)
    {
        $userId = $request->user()->user_id;
        $count = $this->notificationRepository->getUnreadNotificationCount($userId);
        return response()->json(['count' => $count]);
    }

    public function markAsRead($id)
    {
        $this->notificationRepository->markAsRead($id);
        return response()->json(['message' => 'Notification marked as read']);
    }
}