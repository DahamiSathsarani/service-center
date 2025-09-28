<?php

/** --------------------------------------------------------------------------------
 * This repository class manages all the data absctration for users
 *
 *
 *
 *----------------------------------------------------------------------------------*/

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserRepository
{
    protected $users;

    public function __construct(User $users)
    {
        $this->users = $users;
    }

    public function create($user)
    {
        return $this->users::create($user);
    }
    public function search($type, $value)
    {
        try {
            return $this->users->with('userRole')->where([$type => $value, 'status' => 'ACTIVE'])->first();
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
    public function search_all($type, $value)
    {
        return $this->users::where([$type => $value, 'status' => 'ACTIVE'])->get();
    }

    public function update_user_details($update_type, $request)
    {
        $user = Auth::user();
        if ($update_type === "user_details") {
            try {
                $request->validate([
                    'first_name' => ['required', 'string', "regex:/^[a-zA-Z'-]+$/"],
                    'last_name' => ['required', 'string', "regex:/^[a-zA-Z'-]+$/"],
                    'username' => ['required', 'string']
                ]);

                if ($request->hasFile('profile_picture')) {
                    if ($user->profile_picture) {
                        $oldImagePath = str_replace(url('/storage/'), '', $user->profile_picture);
                        Storage::delete('public/' . $oldImagePath);
                    }
                    $imagePath = $request->file('profile_picture')->store('public/profile_pictures');
                    $imageUrl = url(str_replace('public/', 'storage/', $imagePath));
                    $user->profile_picture = $imageUrl;
                    $user->save();
                }

                $user->update(['first_name' => $request->first_name, 'last_name' => $request->last_name, 'username' => $request->username]);

                return $user->fresh();
            } catch (ValidationException $e) {
                return response()->json($e->errors(), 422);
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        } else  if ($update_type === "update_pw") {
            try {
                $request->validate([
                    'old_password' => ['required', 'string'],
                    'new_password' => ['required', 'string', 'min:8'],
                    'confirm_new_password' => ['required', 'string', 'same:new_password'],
                ]);

                if (!Hash::check($request->old_password, $user->password)) {
                    return response()->json(['message' => 'The previous password you entered is incorrect.'], 400);
                }
                if (Hash::check($request->new_password, $user->password)) {
                    return response()->json(['message' => 'The new password cannot be the same as the previous password.'], 400);
                }

                $user->update(['password' => Hash::make($request->new_password)]);

                return $user->fresh();
            } catch (ValidationException $e) {
                return response()->json($e->errors(), 422);
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }
    }

    public function update($user_id, $type, $value)
    {
        return $this->users::where('user_id', $user_id)->update([$type => $value]);
    }
}
