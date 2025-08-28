<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class BookingService
{
    /**
     * Get user's bookings
     */
    public function getUserBookings(User $user): Collection
    {
        return $user->bookings()->with('service')->latest()->get();
    }

    /**
     * Get all bookings (for admin)
     */
    public function getAllBookings(): Collection
    {
        return Booking::with(['user', 'service'])->latest()->get();
    }

    /**
     * Create a new booking
     */
    public function createBooking(array $data, User $user): Booking
    {
        // Check if service exists and is active
        $service = Service::findOrFail($data['service_id']);
        
        if ($service->status !== 'active') {
            throw new \Exception('This service is currently unavailable');
        }

        // Create the booking
        $booking = new Booking($data);
        $booking->user_id = $user->id;
        $booking->status = 'pending';
        $booking->save();

        return $booking->load('service');
    }

    /**
     * Update booking status
     */
    public function updateBookingStatus(Booking $booking, string $status): bool
    {
        return $booking->update(['status' => $status]);
    }

    /**
     * Find booking by ID
     */
    public function findBooking(int $id): ?Booking
    {
        return Booking::find($id);
    }

    /**
     * Find booking by ID or fail
     */
    public function findBookingOrFail(int $id): Booking
    {
        return Booking::findOrFail($id);
    }
}
