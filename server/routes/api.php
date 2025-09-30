<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FolderController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\ArchiveController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Api\NotificationController;

// ----------------- Notifications -----------------
Route::get('/notifications', [NotificationController::class, 'index']);
Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

// ----------------- Archive Management -----------------
// Route to list all archived files and folders
Route::get('/archive', [ArchiveController::class, 'index']);
// Route to restore a specific file from the archive
Route::post('/archive/file/{id}/restore', [ArchiveController::class, 'restoreFile']);
// Route to restore a specific folder from the archive
Route::post('/archive/folder/{id}/restore', [ArchiveController::class, 'restoreFolder']);

// ----------------- Departments -----------------
Route::get('/departments/{slug}/folders', [DepartmentController::class, 'getFolders']);
Route::post('departments/{departmentSlug}/folders', [FolderController::class, 'store']);
Route::apiResource('departments', DepartmentController::class);

// ----------------- Activities -----------------
Route::get('/activities', [ActivityController::class, 'index']);

// ----------------- Users -----------------
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);

// ----------------- Auth (Sanctum) -----------------
Route::post('/user/login', [UserAuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// ----------------- Folders -----------------
Route::get('/folders', [FolderController::class, 'index']);
Route::post('/folders', [FolderController::class, 'store']);
Route::get('/folders/{id}', [FolderController::class, 'show']);
Route::put('/folders/{id}', [FolderController::class, 'update']);
Route::delete('/folders/{id}', [FolderController::class, 'destroy']);

// ----------------- Folders by Slug -----------------
Route::get('/folders/slug/{slug}', [FolderController::class, 'showBySlug']);
// Support both `/folders/{slug}/files`
Route::get('/folders/{slug}/files', [FileController::class, 'indexBySlug']);
Route::post('/folders/{slug}/files', [FileController::class, 'storeBySlug']);
Route::delete('/folders/{slug}/files/{fileId}', [FileController::class, 'destroyBySlug']);
Route::put('/folders/{slug}/files/{fileId}', [FileController::class, 'renameBySlug']);

// Old "slug-prefixed" routes (still supported)
Route::get('/folders/slug/{slug}/files', [FileController::class, 'indexBySlug']);
Route::post('/folders/slug/{slug}/files', [FileController::class, 'storeBySlug']);
Route::delete('/folders/slug/{slug}/files/{fileId}', [FileController::class, 'destroyBySlug']);
Route::put('/folders/slug/{slug}/files/{fileId}', [FileController::class, 'renameBySlug']);

// ----------------- Files by ID -----------------
Route::get('/folders/{folderId}/files', [FileController::class, 'index']);
Route::post('/folders/{folderId}/files', [FileController::class, 'store']);
Route::put('/files/{id}', [FileController::class, 'rename']);
Route::delete('/files/{id}', [FileController::class, 'destroy']);

// ----------------- Auth (Dummy Login) -----------------
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
