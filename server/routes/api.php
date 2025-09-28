<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FolderController;
use App\Http\Controllers\Api\FileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\DepartmentController;    

Route::get('/departments/{slug}/folders', [DepartmentController::class, 'getFolders']);
Route::post('/departments/{slug}/folders', [DepartmentController::class, 'createFolder']);

Route::apiResource('departments', DepartmentController::class);

// Department folders
Route::get('/folders', [FolderController::class, 'index']);
Route::post('/folders', [FolderController::class, 'store']);
Route::get('/folders/{id}', [FolderController::class, 'show']);
Route::put('/folders/{id}', [FolderController::class, 'update']);
Route::delete('/folders/{id}', [FolderController::class, 'destroy']);

// Slug-based folder access
Route::get('/folders/slug/{slug}', [FolderController::class, 'showBySlug']);
Route::get('/folders/slug/{slug}/files', [FileController::class, 'indexBySlug']);
Route::post('/folders/slug/{slug}/files', [FileController::class, 'storeBySlug']);
Route::delete('/folders/slug/{slug}/files/{fileId}', [FileController::class, 'destroyBySlug']);
Route::put('/folders/slug/{slug}/files/{fileId}', [FileController::class, 'renameBySlug']);

Route::get('/folders/{folderId}/files', [FileController::class, 'index']);
Route::post('/folders/{folderId}/files', [FileController::class, 'store']);
Route::put('/files/{id}', [FileController::class, 'rename']);
Route::delete('/files/{id}', [FileController::class, 'destroy']);

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