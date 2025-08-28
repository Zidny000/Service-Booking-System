import React from 'react';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export default function SuccessMessage({ message, className = '' }: SuccessMessageProps) {
  return (
    <div className={`bg-green-50 dark:bg-green-900/40 border border-green-100 dark:border-green-800/50 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center">
            Success Message
          </h3>
          <div className="mt-1 text-sm text-green-700 dark:text-green-300 leading-relaxed">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
