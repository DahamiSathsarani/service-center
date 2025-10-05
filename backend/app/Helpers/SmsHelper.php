<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class SmsHelper
{
    public static function sendSms($phone, $message)
    {
        $userId = env('NOTIFY_USER_ID');
        $apiKey = env('NOTIFY_API_KEY');
        $senderId = env('NOTIFY_SENDER_ID');

        $response = Http::withoutVerifying()->get('https://app.notify.lk/api/v1/send', [
            'user_id' => $userId,
            'api_key' => $apiKey,
            'sender_id' => $senderId,
            'to' => $phone,
            'message' => $message,
        ]);

        return $response->json();
    }
}
