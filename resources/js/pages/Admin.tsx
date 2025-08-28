import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { isAuthenticated } from '../lib/auth';
import Navigation from '../components/Navigation';
import ServiceCard from '../components/ServiceCard';
import ServiceForm from '../components/ServiceForm';
import BookingCard from '../components/BookingCard';
import { Service, Booking, User } from '../types';

export default function Admin() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'bookings'>('services');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const checkAdminAndFetchData = async () => {
      try {
        // Check if user is admin
        const userResponse = await axios.get('/api/get-user');
        if (userResponse.data.status === 'success' && userResponse.data.data?.length > 0) {
          const isAdmin = userResponse.data?.data[0].is_admin;
          if (!isAdmin) {
            window.location.href = '/dashboard';
            return;
          }
        } else {
          window.location.href = '/dashboard';
          return;
        }
        
        // Fetch initial data
        await fetchServices();
        await fetchBookings();
      } catch (error: any) {
        console.error('Error checking admin status:', error);
        if (error.response?.status === 401) {
          window.location.href = '/login';
        } else {
          setError('Failed to load admin data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/admin/services');
      setServices(response.data.data);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services.');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings');
      setBookings(response.data.data);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings.');
    }
  };

  const handleCreateService = async (serviceData: Service) => {
    setFormLoading(true);
    try {
      await axios.post('/api/services', serviceData);
      setShowServiceForm(false);
      await fetchServices();
    } catch (error: any) {
      console.error('Error creating service:', error);
      setError('Failed to create service. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateService = async (serviceData: Service) => {
    if (!editingService?.id) return;
    
    setFormLoading(true);
    try {
      await axios.put(`/api/services/${editingService.id}`, serviceData);
      setShowServiceForm(false);
      setEditingService(null);
      await fetchServices();
    } catch (error: any) {
      console.error('Error updating service:', error);
      setError('Failed to update service. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await axios.delete(`/api/services/${serviceId}`);
      await fetchServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service. Please try again.');
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleServiceSubmit = (serviceData: Service) => {
    if (editingService) {
      handleUpdateService(serviceData);
    } else {
      handleCreateService(serviceData);
    }
  };

  const handleBookingStatusUpdate = (bookingId: number, newStatus: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  if (loading) {
    return (
      <>
        <Head title="Admin Panel" />
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Navigation currentPage="admin" isAdmin={true} />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Admin Panel" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation currentPage="admin" isAdmin={true} />
        
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'services'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  All Bookings
                </button>
              </nav>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-6">
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
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Services</h3>
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Add New Service
                  </button>
                </div>

                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No services</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating a new service.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isAdmin={true}
                        onEdit={handleEditService}
                        onDelete={handleDeleteService}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Bookings</h3>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      No bookings have been made yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        isAdmin={true} 
                        onStatusUpdate={handleBookingStatusUpdate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Service Form Modal */}
        {showServiceForm && (
          <ServiceForm
            service={editingService}
            onSubmit={handleServiceSubmit}
            onCancel={() => {
              setShowServiceForm(false);
              setEditingService(null);
            }}
            loading={formLoading}
          />
        )}
      </div>
    </>
  );
}
