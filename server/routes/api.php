<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CSfolderController;
use App\Http\Controllers\Api\CsFileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\DepartmentController;    

Route::apiResource('departments', DepartmentController::class);

Route::get('/csfolders', [CSfolderController::class, 'index']);
Route::post('/csfolders', [CSfolderController::class, 'store']);
Route::get('/csfolders/{id}', [CSfolderController::class, 'show']);
Route::put('/csfolders/{id}', [CSfolderController::class, 'update']);
Route::delete('/csfolders/{id}', [CSfolderController::class, 'destroy']);

Route::get('/folders/{folderId}/files', [CsFileController::class, 'index']);
Route::post('/folders/{folderId}/files', [CsFileController::class, 'store']);
Route::delete('/files/{id}', [CsFileController::class, 'destroy']);

Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid login details'], 401);
    }

    $user = Auth::user();

    // No Sanctum/token package installed; return a placeholder token
    $token = base64_encode($user->id . '|' . now()->timestamp);

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
});