import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { isAuthenticated, logout } from '../lib/auth';
import Navigation from '../components/Navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/get-user');
        
        if (response.data.status === 'success') {
          // Use the first user from the paginated list
          if (response.data.data?.length > 0) {
            setUser(response.data.data[0]);
            setIsAdmin(response.data.data[0].is_admin);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
          window.location.href = '/login';
        } else {
          setError('Failed to fetch user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head title="Dashboard" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation currentPage="dashboard" isAdmin={isAdmin} />

        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 p-6">
              {error ? (
                <div className="text-red-600 dark:text-red-400">{error}</div>
              ) : user ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Welcome, {user.name}!</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Email: {user.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                      <div className="space-y-3">
                        <a
                          href="/services"
                          className="block w-full px-4 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Browse Services
                        </a>
                        <a
                          href="/bookings"
                          className="block w-full px-4 py-2 bg-gray-600 text-white text-center rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          View My Bookings
                        </a>
                        {isAdmin && (
                          <a
                            href="/admin"
                            className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Admin Panel
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Role:</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {isAdmin ? 'Administrator' : 'Customer'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No user data available.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
