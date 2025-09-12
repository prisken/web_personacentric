/**
 * Reusable Card Component
 * Standardized card component with consistent styling and layout
 */

import React from 'react';
import { COMPONENT_CLASSES } from '../../utils/responsive';

const Card = ({
  children,
  title,
  subtitle,
  header,
  footer,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  rounded = 'medium',
  hover = false,
  onClick,
  ...props
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'small':
        return 'p-3 sm:p-4 lg:p-6';
      case 'medium':
        return 'p-4 sm:p-6 lg:p-8';
      case 'large':
        return 'p-6 sm:p-8 lg:p-12';
      case 'none':
        return 'p-0';
      default:
        return 'p-4 sm:p-6 lg:p-8';
    }
  };

  const getShadowClasses = () => {
    switch (shadow) {
      case 'small':
        return 'shadow-md';
      case 'medium':
        return 'shadow-lg';
      case 'large':
        return 'shadow-xl';
      case 'none':
        return 'shadow-none';
      default:
        return 'shadow-lg';
    }
  };

  const getRoundedClasses = () => {
    switch (rounded) {
      case 'small':
        return 'rounded-lg';
      case 'medium':
        return 'rounded-xl';
      case 'large':
        return 'rounded-2xl';
      case 'none':
        return 'rounded-none';
      default:
        return 'rounded-xl';
    }
  };

  const baseClasses = 'bg-white border border-gray-200 overflow-hidden';
  const paddingClasses = getPaddingClasses();
  const shadowClasses = getShadowClasses();
  const roundedClasses = getRoundedClasses();
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const cardClasses = [
    baseClasses,
    paddingClasses,
    shadowClasses,
    roundedClasses,
    hoverClasses,
    clickableClasses,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      {...props}
    >
      {header && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          {header}
        </div>
      )}
      
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;



