<?php

use App\Models\User;
use App\Models\Service;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

// ======== Customer API Tests =========

test('authenticated user can list available services', function () {
    // Create a user
    $user = User::factory()->create();
    
    // Authenticate the user
    Sanctum::actingAs($user);
    
    // Create some active and inactive services
    $activeService = Service::factory()->create(['status' => 'active']);
    $inactiveService = Service::factory()->create(['status' => 'inactive']);
    
    // Make request to list services
    $response = $this->getJson('/api/services');
    
    // Assert successful response
    $response->assertStatus(200);
    
    // Response should include active service
    $response->assertJsonFragment([
        'id' => $activeService->id,
        'name' => $activeService->name,
    ]);
    
    // Response should not include inactive service
    $response->assertJsonMissing([
        'id' => $inactiveService->id,
        'name' => $inactiveService->name,
    ]);
});

test('unauthenticated user cannot list services', function () {
    // Make request without authentication
    $response = $this->getJson('/api/services');
    
    // Assert unauthorized
    $response->assertStatus(401);
});

test('authenticated user can book a service', function () {
    // Create a user and a service
    $user = User::factory()->create();
    $service = Service::factory()->create(['status' => 'active']);
    
    // Authenticate the user
    Sanctum::actingAs($user);
    
    // Data for booking
    $bookingData = [
        'service_id' => $service->id,
        'booking_date' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'notes' => 'Test booking notes',
    ];
    
    // Make request to book service
    $response = $this->postJson('/api/bookings', $bookingData);
    
    // Assert successful response
    $response->assertStatus(201);
    
    // Assert booking was created in database
    $this->assertDatabaseHas('bookings', [
        'user_id' => $user->id,
        'service_id' => $service->id,
        'status' => 'pending',
    ]);
    
    // Assert response includes correct booking data
    $response->assertJsonFragment([
        'message' => 'Service booked successfully',
    ]);
    $response->assertJsonPath('data.service.id', $service->id);
});

test('user cannot book an inactive service', function () {
    // Create a user and an inactive service
    $user = User::factory()->create();
    $service = Service::factory()->create(['status' => 'inactive']);
    
    // Authenticate the user
    Sanctum::actingAs($user);
    
    // Data for booking
    $bookingData = [
        'service_id' => $service->id,
        'booking_date' => now()->addDays(1)->format('Y-m-d H:i:s'),
    ];
    
    // Make request to book service
    $response = $this->postJson('/api/bookings', $bookingData);
    
    // Assert bad request response
    $response->assertStatus(400);
    
    // Assert booking was not created
    $this->assertDatabaseMissing('bookings', [
        'user_id' => $user->id,
        'service_id' => $service->id,
    ]);
});

test('authenticated user can list their bookings', function () {
    // Create user, service, and bookings
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $service = Service::factory()->create();
    
    // Create booking for the user
    $userBooking = Booking::factory()->create([
        'user_id' => $user->id,
        'service_id' => $service->id,
    ]);
    
    // Create booking for another user
    $otherBooking = Booking::factory()->create([
        'user_id' => $otherUser->id,
        'service_id' => $service->id,
    ]);
    
    // Authenticate the user
    Sanctum::actingAs($user);
    
    // Make request to list user's bookings
    $response = $this->getJson('/api/bookings');
    
    // Assert successful response
    $response->assertStatus(200);
    
    // Response should include user's booking
    $response->assertJsonFragment([
        'id' => $userBooking->id,
    ]);
    
    // Response should not include other user's booking
    $response->assertJsonMissing([
        'id' => $otherBooking->id,
    ]);
});

// ======== Admin API Tests =========

test('admin can create a new service', function () {
    // Create admin user
    $admin = User::factory()->create(['is_admin' => true]);
    
    // Authenticate the admin
    Sanctum::actingAs($admin);
    
    // Service data
    $serviceData = [
        'name' => 'New Test Service',
        'description' => 'This is a test service description',
        'price' => 99.99,
        'status' => 'active',
    ];
    
    // Make request to create service
    $response = $this->postJson('/api/services', $serviceData);
    
    // Assert successful response
    $response->assertStatus(201);
    
    // Assert service was created in database
    $this->assertDatabaseHas('services', [
        'name' => 'New Test Service',
        'description' => 'This is a test service description',
    ]);
    
    // Assert response includes service data
    $response->assertJsonFragment([
        'message' => 'Service created successfully',
    ]);
    
    $response->assertJsonPath('data.name', 'New Test Service');
    $response->assertJsonPath('data.description', 'This is a test service description');
    $response->assertJsonPath('data.status', 'active');
});

test('non-admin cannot create a service', function () {
    // Create regular user (non-admin)
    $user = User::factory()->create(['is_admin' => false]);
    
    // Authenticate the user
    Sanctum::actingAs($user);
    
    // Service data
    $serviceData = [
        'name' => 'New Test Service',
        'description' => 'This is a test service description',
        'price' => 99.99,
    ];
    
    // Make request to create service
    $response = $this->postJson('/api/services', $serviceData);
    
    // Assert forbidden response
    $response->assertStatus(403);
    
    // Assert service was not created
    $this->assertDatabaseMissing('services', [
        'name' => 'New Test Service',
    ]);
});

test('admin can update a service', function () {
    // Create admin user and service
    $admin = User::factory()->create(['is_admin' => true]);
    $service = Service::factory()->create([
        'name' => 'Original Service Name',
        'price' => 50.00,
    ]);
    
    // Authenticate the admin
    Sanctum::actingAs($admin);
    
    // Update data
    $updateData = [
        'name' => 'Updated Service Name',
        'price' => 75.00,
    ];
    
    // Make request to update service
    $response = $this->putJson("/api/services/{$service->id}", $updateData);
    
    // Assert successful response
    $response->assertStatus(200);
    
    // Assert service was updated in database
    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'name' => 'Updated Service Name',
        'price' => 75.00,
    ]);
    
    // Assert response includes updated service data
    $response->assertJsonFragment([
        'message' => 'Service updated successfully',
    ]);
    $response->assertJsonPath('data.name', 'Updated Service Name');
});

test('admin can delete a service', function () {
    // Create admin user and service
    $admin = User::factory()->create(['is_admin' => true]);
    $service = Service::factory()->create();
    
    // Authenticate the admin
    Sanctum::actingAs($admin);
    
    // Make request to delete service
    $response = $this->deleteJson("/api/services/{$service->id}");
    
    // Assert successful response
    $response->assertStatus(200);
    
    // Assert service was deleted from database
    $this->assertDatabaseMissing('services', [
        'id' => $service->id,
    ]);
    
    // Assert response message
    $response->assertJsonFragment([
        'message' => 'Service deleted successfully',
    ]);
});

test('admin can list all bookings', function () {
    // Create admin, users, service, and bookings
    $admin = User::factory()->create(['is_admin' => true]);
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $service = Service::factory()->create();
    
    // Create bookings for different users
    $booking1 = Booking::factory()->create([
        'user_id' => $user1->id,
        'service_id' => $service->id,
    ]);
    
    $booking2 = Booking::factory()->create([
        'user_id' => $user2->id,
        'service_id' => $service->id,
    ]);
    
    // Authenticate the admin
    Sanctum::actingAs($admin);
    
    // Make request to list all bookings
    $response = $this->getJson('/api/admin/bookings');
    
    // Assert successful response
    $response->assertStatus(200);
    
    // Response should include both bookings
    $response->assertJsonFragment([
        'id' => $booking1->id,
    ]);
    
    $response->assertJsonFragment([
        'id' => $booking2->id,
    ]);
});

test('non-admin cannot list all bookings', function () {
    // Create regular user
    $user = User::factory()->create(['is_admin' => false]);
    
    // Authenticate the user
    Sanctum::actingAs($user);
    
    // Make request to list all bookings
    $response = $this->getJson('/api/admin/bookings');
    
    // Assert forbidden response
    $response->assertStatus(403);
});
