<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\DepartmentController;

Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);


