<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CSfolderController;

Route::get('/csfolders', [CSfolderController::class, 'index']);
Route::post('/csfolders', [CSfolderController::class, 'store']);
Route::get('/csfolders/{id}', [CSfolderController::class, 'show']);
Route::put('/csfolders/{id}', [CSfolderController::class, 'update']);
Route::delete('/csfolders/{id}', [CSfolderController::class, 'destroy']);
