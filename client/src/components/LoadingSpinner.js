import React from 'react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    default: 'h-8 w-8 lg:h-12 lg:w-12',
    large: 'h-16 w-16 lg:h-20 lg:w-20'
  };

  const textSizes = {
    small: 'text-sm lg:text-base',
    default: 'text-base lg:text-lg',
    large: 'text-lg lg:text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {text && (
        <span className={`text-gray-600 font-medium ${textSizes[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner; 