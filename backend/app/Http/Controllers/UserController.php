<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetMail;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Repositories\LogRepository;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    protected $userrepo;
    protected $logrepo;

    public function __construct(UserRepository $userrepo, LogRepository $logrepo)
    {
        $this->userrepo = $userrepo;
        $this->logrepo = $logrepo;
    }
    public function user_registration(Request $request)
    {
        try {
            $request->validate([
                'first_name' => ['required', 'string', "regex:/^[a-zA-Z'-]+$/"],
                'last_name' => ['required', 'string', "regex:/^[a-zA-Z'-]+$/"],
                'email' => ['required', 'string', 'unique:users,email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'],
                'password' => ['required', 'string', 'min:8'],
                'confirm_password' => ['required', 'string', 'same:password'],
            ]);

            $user = [
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'username' => $request->first_name . ' ' . $request->last_name,
                'status' => 'ACTIVE',
                'role_id' => 2
            ];
            $user = $this->userrepo->create($user);

            if ($user) {
                $this->logrepo->create('Create', 'User', "User created successfully ({$user->email})");
                return response()->json(["message" => "User Created Successfully"], 200);
            }
            return response()->json(["message" => "Record not found"], 404);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function userLogin(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            if (Auth::attempt($credentials)) {

                $user = $this->userrepo->search('email', $request->email);
                if ($user->status == 'ACTIVE') {
                    // Delete all previous tokens for the user
                    $user->tokens()->delete();

                    // Set an expiration time (e.g., 1 hour from now)
                    $expiration = now()->addHours(1);

                    // Issue a Sanctum token
                    $token = $user->createToken(env('APP_NAME'), ['*'])->plainTextToken;

                    // Store the expiration time in the database
                    $user->tokens()->latest()->first()->update([
                        'expires_at' => $expiration
                    ]);
                    $this->logrepo->create('Login', 'User', "User logged in successfully ({$user->email})");

                    return response()->json([
                        'message' => 'Login Successfully',
                        'user_type' => $user->role_id,
                        'token' => $token
                    ], 200);
                } else {
                    return response()->json(['message' => 'Inactive User'], 400);
                }
            } else {
                return response()->json(['message' => 'UnAuthoriz'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function getAuthUserDetails($user_id)
    {
        Log::info('user_id', ['user_id' => $user_id]);
        if ($user_id == 0) {
            $user = Auth::user()->load('userRole');
        } else {
            $user = $this->userrepo->search('user_id', $user_id);
            Log::info('user', ['user' => $user]);
        }
        return response()->json(["message" => 'User Fetched Successfully', 'user' => $user], 200);
    }

    public function updateUserDetails(Request $request)
    {
        try {
            $user = $this->userrepo->update_user_details($request->update_type, $request);

            $this->logrepo->create('Update', 'User', "User updated profile successfully ({$user->email})");

            return response()->json(["message" => 'User Updated Successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function send_resetLink(Request $request)
    {
        try {
            $request->validate([
                'email' => ['required', 'email', 'exists:users,email']
            ]);
            $user = $this->userrepo->search('email', $request->email);
            $token = app('auth.password.broker')->createToken($user); // Create the token
            $resetLink = env('FRONTEND_URL') . '/reset-password/' . $token;
            Mail::to($request->email)->send(new PasswordResetMail($resetLink));
            return response()->json(['message' => 'Password reset link sent to your email.'], 200);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function showResetPasswordForm($token)
    {
        return response()->json(['token' => $token]);
    }
    public function reset_password(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|confirmed',
            'token' => 'required'
        ]);

        $credentials = $request->only('email', 'password', 'token');
        $status = Password::reset($credentials, function ($user) use ($request) {
            $user->password = bcrypt($request->password);
            $user->save();
        });

        return $status == Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successfully.'], 200)
            : response()->json(['message' => 'Failed to reset password.'], 500);
    }

    public function get_users_by_type($role_id)
    {
        try {
            $users = $this->userrepo->search_all('role_id', $role_id);
            return response()->json(['message' => "Fetch data successfully", "users" => $users], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function delete_user($user_id)
    {
        try {
            $user = $this->userrepo->update($user_id, 'status', 'INACTIVE');
            return response()->json(['message' => "Deleted user successfully", "user" => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function activate_user($user_id)
    {
        try {
            $user = $this->userrepo->update($user_id, 'status', 'ACTIVE');
            return response()->json(['message' => "Activated user successfully", "user" => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
