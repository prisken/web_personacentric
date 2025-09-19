/**
 * Reusable Loading Spinner Component
 * Standardized loading spinner with different sizes and styles
 */

import React from 'react';

const LoadingSpinner = ({
  size = 'medium',
  color = 'blue',
  text = '',
  className = '',
  fullScreen = false,
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-8 h-8';
      case 'large':
        return 'w-12 h-12';
      case 'xl':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'white':
        return 'text-white';
      case 'gray':
        return 'text-gray-600';
      case 'green':
        return 'text-green-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const spinnerClasses = [
    'animate-spin',
    getSizeClasses(),
    getColorClasses(),
    className
  ].filter(Boolean).join(' ');

  const spinner = (
    <svg
      className={spinnerClasses}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          {text && (
            <p className="mt-4 text-gray-600 text-sm">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex items-center justify-center space-x-2">
        {spinner}
        <span className="text-gray-600 text-sm">
          {text}
        </span>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;









