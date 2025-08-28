import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { isAuthenticated } from '../lib/auth';
import Navigation from '../components/Navigation';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
}

interface BookServiceProps {
  serviceId: number;
}

export default function BookService({ serviceId }: BookServiceProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchService = async () => {
      try {
        const response = await axios.get('/api/services');
        const foundService = response.data.data.find((s: Service) => s.id === serviceId);
        if (foundService) {
          setService(foundService);
        } else {
          setError('Service not found');
        }
      } catch (error: any) {
        console.error('Error fetching service:', error);
        setError('Failed to fetch service details');
        
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!bookingDate || !bookingTime) {
      setError('Please select both date and time for your booking');
      setSubmitting(false);
      return;
    }

    // Format the date and time
    const formattedDateTime = `${bookingDate}T${bookingTime}:00`;

    try {
      const response = await axios.post('/api/bookings', {
        service_id: serviceId,
        booking_date: formattedDateTime,
        notes: notes
      });

      setSuccess('Booking successful! You will receive a confirmation shortly.');
      setBookingDate('');
      setBookingTime('');
      setNotes('');

      // Redirect to bookings page after a delay
      setTimeout(() => {
        window.location.href = '/bookings';
      }, 2000);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to create booking. Please try again.');
      }
      
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head title="Book Service" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation currentPage="services" />

        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Service</h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : service ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{service.name}</h3>
                <p className="mt-1 max-w-2xl text-gray-500 dark:text-gray-400">{service.description}</p>
                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">${parseFloat(service.price.toString()).toFixed(2)}</p>
              </div>

              {success ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-4 my-2" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </label>
                        <input
                          type="date"
                          id="bookingDate"
                          name="bookingDate"
                          min={new Date().toISOString().split('T')[0]}
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time
                        </label>
                        <input
                          type="time"
                          id="bookingTime"
                          name="bookingTime"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Notes (Optional)
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Any special requests or additional information"
                        ></textarea>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 ${
                            submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }`}
                        >
                          {submitting ? 'Processing...' : 'Confirm Booking'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Service not found. Please return to services page and try again.</span>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
