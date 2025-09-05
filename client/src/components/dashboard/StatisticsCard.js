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
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${getColorClasses(color)} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
            {typeof icon === 'string' ? (
              <span className="text-white text-base sm:text-lg">{icon}</span>
            ) : (
              <div className="text-white">
                {icon}
              </div>
            )}
          </div>
        </div>
        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {trend && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(trendDirection)}
                <span className={`text-xs sm:text-sm font-medium ${
                  trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard; 