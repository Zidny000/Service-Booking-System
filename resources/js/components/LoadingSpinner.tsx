import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 ${sizeClasses[size]}`}></div>
        <div className={`absolute top-0 left-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-600 dark:border-t-indigo-400 ${sizeClasses[size]}`}></div>
      </div>
    </div>
  );
}
