<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Dashboard');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('auth/Register');
})->name('register');

// Protected routes - client-side protection is in place
// Server-side middleware protection could be added for extra security
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

Route::get('/bookings', function () {
    return Inertia::render('Bookings');
})->name('bookings');

Route::get('/admin', function () {
    return Inertia::render('Admin');
})->name('admin');

Route::get('/book-service/{id}', function ($id) {
    return Inertia::render('BookService', ['serviceId' => (int) $id]);
})->name('book-service');
