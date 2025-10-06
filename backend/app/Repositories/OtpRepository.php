<?php

namespace App\Repositories;

use App\Models\Otp;
use Carbon\Carbon;

class OtpRepository
{
    public function saveOtp($mobile_number, $otp)
    {
        return Otp::updateOrCreate(
            ['mobile_number' => $mobile_number],
            [
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(2),
            ]
        );
    }

    public function verifyOtp($mobile_number, $otp)
    {
        $otpRecord = Otp::where('mobile_number', $mobile_number)->first();

        if (!$otpRecord) {
            return 'not_found';
        }

        if ($otpRecord->otp !== $otp) {
            return 'invalid'; 
        }

        if ($otpRecord->expires_at < Carbon::now()) {
            $otpRecord->delete();
            return 'expired';
        }

        $otpRecord->delete();
        return 'valid';
    }

    public function deleteOtps($mobile_number)
    {
        Otp::where('mobile_number', $mobile_number)->delete();
    }
}
