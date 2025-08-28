import React from 'react';
import { isAuthenticated, logout } from '../lib/auth';

interface NavigationProps {
  isAdmin?: boolean;
  currentPage?: string;
}

export default function Navigation({ isAdmin = false, currentPage = 'dashboard' }: NavigationProps) {
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const isActive = (page: string) => currentPage === page;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Service Booking System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('dashboard')
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              Dashboard
            </a>
            
            <a
              href="/services"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('services')
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              Services
            </a>
            
            <a
              href="/bookings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('bookings')
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              My Bookings
            </a>
            
            {isAdmin && (
              <a
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('admin')
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Admin Panel
              </a>
            )}
            
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
