<?php

use Illuminate\Http\Request;
use App\Http\Middleware\IsUserAuth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Gate;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware([IsUserAuth::class])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/task', [TaskController::class, 'addTask']);
    Route::get('/tasks/{id}', [TaskController::class, 'getTasks']);
    Route::get('/task/{id}', [TaskController::class, 'getTaskById']);
    Route::put('/task/{id}', [TaskController::class,'updateTask']);
    Route::delete('/task/{id}', [TaskController::class,'deleteTask']);

   // if (Gate::allows('is-admin')) {
    //Route::middleware([IsAdmin::class])->group(function () {
        Route::delete('/deleteuser/{id}', [AuthController::class,'deleteUserById']);
        Route::get('/getusers', [AuthController::class,'getUsers']);
    //});
    //}

});

//Route::get('/user', [App\Http\Controllers\AuthController::class, 'user'])->middleware('auth:sanctum');