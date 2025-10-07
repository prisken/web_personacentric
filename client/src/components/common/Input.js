/**
 * Reusable Input Component
 * Standardized input component with consistent styling and validation
 */

import React, { forwardRef } from 'react';
import { COMPONENT_CLASSES } from '../../utils/responsive';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  className = '',
  icon = null,
  iconPosition = 'left',
  size = 'medium',
  fullWidth = true,
  ...props
}, ref) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-sm';
      case 'medium':
        return 'px-3 py-2 text-sm';
      case 'large':
        return 'px-4 py-3 text-base';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  const baseClasses = 'border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200';
  const sizeClasses = getSizeClasses();
  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';

  const inputClasses = [
    baseClasses,
    sizeClasses,
    widthClasses,
    disabledClasses,
    errorClasses,
    className
  ].filter(Boolean).join(' ');

  const containerClasses = icon ? 'relative' : '';

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = typeof icon === 'string' ? (
      <span className="text-gray-400">{icon}</span>
    ) : icon;

    return (
      <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
        {iconElement}
      </div>
    );
  };

  const getInputPadding = () => {
    if (!icon) return '';
    
    if (iconPosition === 'left') {
      return size === 'small' ? 'pl-8' : size === 'large' ? 'pl-12' : 'pl-10';
    } else {
      return size === 'small' ? 'pr-8' : size === 'large' ? 'pr-12' : 'pr-10';
    }
  };

  const inputWithPadding = icon ? `${inputClasses} ${getInputPadding()}` : inputClasses;

  return (
    <div className={containerClasses}>
      {label && (
        <label className={COMPONENT_CLASSES.label}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {renderIcon()}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={inputWithPadding}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;




















