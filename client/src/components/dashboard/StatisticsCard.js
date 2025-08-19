import React from 'react';

const StatisticsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  trend = null, 
  trendDirection = 'up',
  subtitle = null 
}) => {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      gray: 'bg-gray-500'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTrendIcon = (direction) => {
    if (direction === 'up') {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (direction === 'down') {
      return (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return null;
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 lg:w-16 lg:h-16 ${getColorClasses(color)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {typeof icon === 'string' ? (
              <span className="text-white text-lg lg:text-xl">{icon}</span>
            ) : (
              <div className="text-white">
                {icon}
              </div>
            )}
          </div>
        </div>
        <div className="ml-4 lg:ml-6 flex-1">
          <p className="text-sm lg:text-base font-medium text-gray-500">{title}</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl lg:text-3xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {trend && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(trendDirection)}
                <span className={`text-sm font-medium ${
                  trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs lg:text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard; 