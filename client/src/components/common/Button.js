/**
 * Reusable Button Component
 * Standardized button component with consistent styling and behavior
 */

import React from 'react';
import { COMPONENT_CLASSES } from '../../utils/responsive';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return COMPONENT_CLASSES.primaryButton;
      case 'secondary':
        return COMPONENT_CLASSES.secondaryButton;
      case 'danger':
        return 'bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg';
      case 'success':
        return 'bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg';
      case 'warning':
        return 'bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300';
      case 'ghost':
        return 'text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300';
      default:
        return COMPONENT_CLASSES.primaryButton;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return COMPONENT_CLASSES.buttonSmall;
      case 'medium':
        return COMPONENT_CLASSES.buttonMedium;
      case 'large':
        return COMPONENT_CLASSES.buttonLarge;
      default:
        return COMPONENT_CLASSES.buttonMedium;
    }
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = typeof icon === 'string' ? (
      <span className="text-lg">{icon}</span>
    ) : icon;

    return (
      <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>
        {iconElement}
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          {renderIcon()}
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
