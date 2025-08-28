import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: number) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (serviceId: number) => void;
  isAdmin?: boolean;
}

export default function ServiceCard({ 
  service, 
  onBook, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}: ServiceCardProps) {
  const isActive = service.status === 'active';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {service.name}
          </h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${
            isActive 
              ? 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="mb-6 mt-2">
          <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
            {service.description}
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ${service.price}
            </span>
          </div>
          
          <div className="flex space-x-2">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onEdit?.(service)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </div>
                </button>
                <button
                  onClick={() => service.id && onDelete?.(service.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-sm rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </div>
                </button>
              </>
            ) : (
              <button
                onClick={() => service.id && onBook?.(service.id)}
                disabled={!isActive}
                className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center ${
                  isActive
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isActive ? (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Book Now
                  </>
                ) : 'Unavailable'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
