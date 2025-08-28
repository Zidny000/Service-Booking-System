import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 dark:bg-red-900/40 border border-red-100 dark:border-red-800/50 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300 flex items-center">
            Error Message
          </h3>
          <div className="mt-1 text-sm text-red-700 dark:text-red-300 leading-relaxed">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
