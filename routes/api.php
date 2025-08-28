<?php

Route::group(['namespace' => 'App\Http\Controllers\API'], function () {
    // -------------- Register and Login --------------
    Route::post('register', 'AuthenticationController@register')->name('register');
    Route::post('login', 'AuthenticationController@login')->name('login');

    //
    // -------------- Get Data ---------------
    //
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('get-user', 'AuthenticationController@userInfo')->name('get-user');
        Route::post('logout', 'AuthenticationController@logOut')->name('logout');
        
        // Customer Routes
        Route::get('services', 'ServiceController@index');
        Route::post('bookings', 'BookingController@store');
        Route::get('bookings', 'BookingController@index');
        
        // Admin Routes
        Route::middleware('admin')->group(function () {
            Route::get('admin/services', 'ServiceController@adminIndex');
            Route::post('services', 'ServiceController@store');
            Route::put('services/{id}', 'ServiceController@update');
            Route::delete('services/{id}', 'ServiceController@destroy');
            Route::get('admin/bookings', 'BookingController@adminIndex');
            Route::put('admin/bookings/{id}/status', 'BookingController@updateStatus');
        });
    });
});
