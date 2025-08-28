import React, { useState } from 'react';
import axios from 'axios';
import { User, Service, Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
  isAdmin?: boolean;
  onStatusUpdate?: (bookingId: number, newStatus: string) => void;
}

export default function BookingCard({ booking, isAdmin = false, onStatusUpdate }: BookingCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(booking.status);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      await axios.put(`/api/admin/bookings/${booking.id}/status`, {
        status: newStatus
      });
      
      setCurrentStatus(newStatus);
      if (onStatusUpdate) {
        onStatusUpdate(booking.id, newStatus);
      }
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      // Revert to previous status on error
      setCurrentStatus(booking.status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {booking.service?.name || 'Service'}
            </h3>
            {isAdmin && booking.user && (
              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {booking.user.name} 
                <span className="mx-1.5 text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-500 text-xs">{booking.user.email}</span>
              </div>
            )}
          </div>
          
          {isAdmin ? (
            <div className="flex items-center space-x-2 relative">
              {isUpdating && (
                <div className="absolute -left-6 animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
              )}
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 appearance-none pr-8 ${getStatusColor(currentStatus)}`}
                style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(booking.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* Details Section with improved visuals */}
        <div className="mb-5 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Booking Date
            </div>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatDate(booking.booking_date)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd" />
              </svg>
              Booked On
            </div>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatDate(booking.created_at)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Price
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              ${booking.service?.price || 'N/A'}
            </span>
          </div>
        </div>
        
        {/* Notes Section with improved visuals */}
        {booking.notes && (
          <div className="mb-4">
            <div className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-sm">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Notes
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-sm mt-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
              {booking.notes}
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="pt-2 mt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
            ID: {booking.id}
          </span>
        </div>
      </div>
    </div>
  );
}
