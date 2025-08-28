<?php

namespace Tests\Unit;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected BookingService $bookingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bookingService = new BookingService();
    }

    public function test_can_get_user_bookings()
    {
        $user = User::factory()->create();
        $service = Service::factory()->create();
        
        Booking::factory()->count(3)->create([
            'user_id' => $user->id,
            'service_id' => $service->id
        ]);

        $userBookings = $this->bookingService->getUserBookings($user);

        $this->assertCount(3, $userBookings);
        $this->assertEquals($user->id, $userBookings->first()->user_id);
    }

    public function test_can_get_all_bookings()
    {
        $user = User::factory()->create();
        $service = Service::factory()->create();
        
        Booking::factory()->count(3)->create([
            'user_id' => $user->id,
            'service_id' => $service->id
        ]);

        $allBookings = $this->bookingService->getAllBookings();

        $this->assertCount(3, $allBookings);
    }

    public function test_can_create_booking_with_active_service()
    {
        $user = User::factory()->create();
        $service = Service::factory()->create(['status' => 'active']);
        
        $bookingData = [
            'service_id' => $service->id,
            'booking_date' => now()->addDays(1),
            'notes' => 'Test booking'
        ];

        $booking = $this->bookingService->createBooking($bookingData, $user);

        $this->assertInstanceOf(Booking::class, $booking);
        $this->assertEquals($user->id, $booking->user_id);
        $this->assertEquals($service->id, $booking->service_id);
        $this->assertEquals('pending', $booking->status);
    }

    public function test_cannot_create_booking_with_inactive_service()
    {
        $user = User::factory()->create();
        $service = Service::factory()->create(['status' => 'inactive']);
        
        $bookingData = [
            'service_id' => $service->id,
            'booking_date' => now()->addDays(1),
            'notes' => 'Test booking'
        ];

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('This service is currently unavailable');

        $this->bookingService->createBooking($bookingData, $user);
    }

    public function test_can_update_booking_status()
    {
        $booking = Booking::factory()->create(['status' => 'pending']);

        $result = $this->bookingService->updateBookingStatus($booking, 'confirmed');

        $this->assertTrue($result);
        $this->assertEquals('confirmed', $booking->fresh()->status);
    }

    public function test_can_find_booking_by_id()
    {
        $booking = Booking::factory()->create();

        $foundBooking = $this->bookingService->findBooking($booking->id);

        $this->assertInstanceOf(Booking::class, $foundBooking);
        $this->assertEquals($booking->id, $foundBooking->id);
    }

    public function test_returns_null_for_nonexistent_booking()
    {
        $foundBooking = $this->bookingService->findBooking(999);

        $this->assertNull($foundBooking);
    }
}
