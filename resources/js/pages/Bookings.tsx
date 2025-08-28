import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { isAuthenticated } from '../lib/auth';
import Navigation from '../components/Navigation';
import BookingCard from '../components/BookingCard';
import type { User, Service, Booking } from '../types';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchBookings = async () => {
      try {
        // Check if user is admin
        const userResponse = await axios.get('/api/get-user');
        if (userResponse.data.status === 'success' && userResponse.data.data?.length > 0) {
          setIsAdmin(userResponse.data.data[0].is_admin);
        }
        
        // Fetch bookings based on user role
        const endpoint = '/api/bookings';
        const response = await axios.get(endpoint);
        setBookings(response.data.data);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings. Please try again.');
        
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAdmin]);

  if (loading) {
    return (
      <>
        <Head title="My Bookings" />
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Navigation currentPage="bookings" isAdmin={isAdmin} />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="My Bookings" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation currentPage="bookings" isAdmin={isAdmin} />
        
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? 'All Bookings' : 'My Bookings'}
            </h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {error ? (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bookings</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {isAdmin ? 'No bookings have been made yet.' : 'You haven\'t made any bookings yet.'}
                </p>
                {!isAdmin && (
                  <div className="mt-6">
                    <a
                      href="/services"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Browse Services
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isAdmin={isAdmin} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
