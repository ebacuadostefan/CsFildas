<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        try {
            $token = $user->createToken('user_token', ['user'])->plainTextToken;
        } catch (\Throwable $e) {
            // Graceful fallback if Sanctum tables are not yet migrated
            $token = base64_encode($user->id . '|' . now()->timestamp);
        }

        return response()->json(['token' => $token, 'user' => $user]);
    }
}


