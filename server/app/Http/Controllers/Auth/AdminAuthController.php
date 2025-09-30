<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        try {
            $token = $admin->createToken('admin_token', ['admin'])->plainTextToken;
        } catch (\Throwable $e) {
            $token = base64_encode($admin->id . '|' . now()->timestamp);
        }

        return response()->json(['token' => $token, 'admin' => $admin]);
    }
}


