import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';

const EventDetailsOverlay = ({ event, isOpen, onClose, onRegistrationChange }) => {
  const { t, language } = useLanguage();
  const { user } = useUser();

  if (!isOpen || !event) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeLabel = (eventType) => {
    return t(`events.${eventType}`) || eventType;
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      workshop: 'bg-blue-500',
      seminar: 'bg-green-500',
      consultation: 'bg-purple-500',
      webinar: 'bg-orange-500'
    };
    return colors[eventType] || 'bg-gray-500';
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleRegisterForEvent = async () => {
    try {
      const response = await apiService.registerForEvent(event.id);
      if (response.success) {
        alert(t('common.success'));
        onRegistrationChange();
        onClose();
      }
    } catch (error) {
      alert(t('common.error') + ': ' + error.message);
    }
  };

  const youtubeId = extractYouTubeId(event.video_url);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Image and Video */}
          <div className="mb-6">
            {youtubeId ? (
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={event.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Event Type Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getEventTypeColor(event.event_type)}`}>
              {getEventTypeLabel(event.event_type)}
            </span>
            <span className="text-sm text-gray-500">
              {event.registrations_count || 0} {t('events.registered')}
            </span>
          </div>

          {/* Event Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('events.description')}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date and Time */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">
                {t('events.dateAndTime')}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(event.start_date)} - {formatTime(event.end_date)}</span>
                </div>
              </div>
            </div>

            {/* Location and Capacity */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">
                {t('events.locationAndCapacity')}
              </h4>
              <div className="space-y-2">
                {event.location && (
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                )}
                {event.max_participants && (
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{event.current_participants || 0} / {event.max_participants} {t('events.participants')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing and Rewards */}
          {(event.price || event.points_reward) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t('events.pricingAndRewards')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.price !== null && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('events.price')}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {event.price === 0 ? t('events.free') : `HKD ${event.price}`}
                    </div>
                  </div>
                )}
                {event.points_reward > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600 mb-1">{t('events.pointsReward')}</div>
                    <div className="text-2xl font-bold text-blue-900">
                      +{event.points_reward} {t('events.points')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            {user ? (
              <button
                onClick={handleRegisterForEvent}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('events.register')}
              </button>
            ) : (
              <button
                onClick={() => window.location.href = '/login'}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('events.loginToRegister')}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsOverlay;
