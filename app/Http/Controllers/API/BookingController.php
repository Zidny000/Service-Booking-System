<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Requests\Booking\UpdateBookingStatusRequest;
use App\Http\Resources\BookingResource;
use App\Services\BookingService;
use Illuminate\Http\Response;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a listing of the current user's bookings.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $bookings = $this->bookingService->getUserBookings(auth()->user());
        
        return response()->json([
            'status' => 'success',
            'data' => BookingResource::collection($bookings)
        ]);
    }

    /**
     * Display a listing of all bookings (Admin only).
     *
     * @return \Illuminate\Http\Response
     */
    public function adminIndex()
    {
        $bookings = $this->bookingService->getAllBookings();
        
        return response()->json([
            'status' => 'success',
            'data' => BookingResource::collection($bookings)
        ]);
    }

    /**
     * Store a newly created booking in storage.
     *
     * @param  \App\Http\Requests\Booking\StoreBookingRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBookingRequest $request)
    {
        try {
            $validated = $request->validated();
            $booking = $this->bookingService->createBooking($validated, auth()->user());

            return response()->json([
                'status' => 'success',
                'message' => 'Service booked successfully',
                'data' => new BookingResource($booking)
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Update the status of a booking (Admin only).
     *
     * @param  \App\Http\Requests\Booking\UpdateBookingStatusRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(UpdateBookingStatusRequest $request, $id)
    {
        $validated = $request->validated();
        $booking = $this->bookingService->findBookingOrFail($id);
        
        $this->bookingService->updateBookingStatus($booking, $validated['status']);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking status updated successfully',
            'data' => new BookingResource($booking->load(['user', 'service']))
        ]);
    }
}
