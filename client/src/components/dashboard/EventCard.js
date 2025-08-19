import React, { useState } from 'react';

const EventCard = ({ 
  event, 
  onRegister, 
  onUnregister, 
  onViewDetails, 
  showRegistrationStatus = true,
  showClientInfo = false,
  loading = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeLabel = (eventType) => {
    const typeMap = {
      'workshop': '工作坊',
      'seminar': '研討會',
      'consultation': '諮詢',
      'webinar': '網路研討會'
    };
    return typeMap[eventType] || eventType;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'registered': 'bg-blue-100 text-blue-800',
      'attended': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleAction = async (action) => {
    if (loading || isLoading) return;
    
    setIsLoading(true);
    try {
      if (action === 'register') {
        await onRegister(event.id);
      } else if (action === 'unregister') {
        await onUnregister(event.id);
      } else if (action === 'view') {
        onViewDetails(event);
      }
    } catch (error) {
      console.error('Event action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isRegistered = event.is_registered || event.registration_status;
  const isFull = event.max_participants && event.current_participants >= event.max_participants;
  const isPast = new Date(event.start_date) < new Date();

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105">
      {/* Event Image */}
      <div className="h-32 sm:h-40 lg:h-48 xl:h-56 overflow-hidden relative">
        <img 
          src={event.image ? event.image : "/images/food-for-talk.jpg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Status Overlay */}
        {showRegistrationStatus && isRegistered && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.registration_status)}`}>
              {event.registration_status === 'registered' ? '已註冊' :
               event.registration_status === 'attended' ? '已參加' :
               event.registration_status === 'cancelled' ? '已取消' : '未出席'}
            </span>
          </div>
        )}
        
        {/* Full Event Badge */}
        {isFull && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
              已滿額
            </span>
          </div>
        )}
        
        {/* Past Event Badge */}
        {isPast && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
              已結束
            </span>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Event Type Badge */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs lg:text-sm font-medium text-white bg-blue-500">
            {getEventTypeLabel(event.event_type)}
          </span>
          <span className="text-xs lg:text-sm text-gray-500">
            {event.current_participants || 0}/{event.max_participants || '∞'} 已註冊
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
          {event.title}
        </h3>

        {/* Event Description */}
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-6 line-clamp-3">
          {event.description}
        </p>

        {/* Client Info (for agent dashboard) */}
        {showClientInfo && event.user && (
          <div className="mb-3 sm:mb-4 lg:mb-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-blue-600">
                  {event.user.first_name.charAt(0)}{event.user.last_name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {event.user.first_name} {event.user.last_name}
                </p>
                <p className="text-xs text-gray-500">{event.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Event Details */}
        <div className="space-y-1 sm:space-y-2 lg:space-y-3 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center text-xs sm:text-sm lg:text-base text-gray-500">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 lg:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.start_date)}
          </div>
          <div className="flex items-center text-xs sm:text-sm lg:text-base text-gray-500">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 lg:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(event.start_date)}
          </div>
          {event.location && (
            <div className="flex items-center text-xs sm:text-sm lg:text-base text-gray-500">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 lg:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          )}
          {event.points_reward > 0 && (
            <div className="flex items-center text-xs sm:text-sm lg:text-base text-yellow-600">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 lg:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              獎勵 {event.points_reward} 積分
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {isRegistered ? (
            <button
              onClick={() => handleAction('unregister')}
              disabled={loading || isLoading || isPast}
              className="flex-1 bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isLoading ? '取消中...' : '取消註冊'}
            </button>
          ) : (
            <button
              onClick={() => handleAction('register')}
              disabled={loading || isLoading || isFull || isPast}
              className="flex-1 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isLoading ? '註冊中...' : isFull ? '已滿額' : isPast ? '已結束' : '立即註冊'}
            </button>
          )}
          
          <button
            onClick={() => handleAction('view')}
            className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            查看詳情
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 