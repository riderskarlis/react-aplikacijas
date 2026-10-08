<?php

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BlogController::class, 'index'])->name('home');
Route::post('/register', [BlogController::class, 'register'])->name('register');
Route::post('/login', [BlogController::class, 'login'])->name('login');
Route::post('/logout', [BlogController::class, 'logout'])->middleware('auth')->name('logout');

Route::middleware('auth')->group(function () {
    Route::post('/posts', [BlogController::class, 'storePost'])->name('posts.store');
    Route::post('/posts/{post}/comments', [BlogController::class, 'storeComment'])->name('comments.store');
});
