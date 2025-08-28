import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { isAuthenticated } from '../lib/auth';
import Navigation from '../components/Navigation';
import ServiceCard from '../components/ServiceCard';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchServices = async () => {
      try {
        const userResponse = await axios.get('/api/get-user');
        if (userResponse.data.status === 'success' && userResponse.data.data?.length > 0) {
          setIsAdmin(userResponse.data.data[0].is_admin);
        }
        
        const response = await axios.get('/api/services');
        setServices(response.data.data);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setError('Failed to fetch services. Please try again.');
        
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookService = (serviceId: number) => {
    window.location.href = `/book-service/${serviceId}`;
  };

  return (
    <>
      <Head title="Services" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation currentPage="services" isAdmin={isAdmin} />

        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Services</h2>
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
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.length > 0 ? (
                services.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBook={handleBookService}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                  No services available at the moment.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
