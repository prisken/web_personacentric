import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';
import EventDetailsOverlay from '../components/EventDetailsOverlay';

const EventsPage = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showEventOverlay, setShowEventOverlay] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents({ status: 'published' });
      if (response.success) {
        setEvents(response.events);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const response = await apiService.getUserEventRegistrations();
      if (response.success) {
        setUserRegistrations(response.registrations);
      }
    } catch (error) {
      console.error('Failed to fetch user registrations:', error);
    }
  };

  const handleRegisterForEvent = async (eventId) => {
    try {
      const response = await apiService.registerForEvent(eventId);
      if (response.success) {
        alert(t('common.success'));
        fetchUserRegistrations();
        fetchEvents(); // Refresh events to update registration count
      }
    } catch (error) {
      alert(t('common.error') + ': ' + error.message);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      const response = await apiService.cancelEventRegistration(eventId);
      if (response.success) {
        alert(t('common.success'));
        fetchUserRegistrations();
        fetchEvents(); // Refresh events to update registration count
      }
    } catch (error) {
      alert(t('common.error') + ': ' + error.message);
    }
  };

  const isUserRegistered = (eventId) => {
    return userRegistrations.some(reg => reg.event_id === eventId && reg.status === 'registered');
  };

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

  const filteredEvents = events.filter(event => {
    const now = new Date();
    const eventDate = new Date(event.start_date);
    
    if (activeTab === 'upcoming') {
      return eventDate >= now;
    } else if (activeTab === 'past') {
      return eventDate < now;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/event hero image.jpg" 
            alt="Event Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-purple-900/60 to-pink-900/70"></div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative bg-transparent backdrop-blur-sm shadow-xl border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8 sm:py-12 lg:py-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
                  {t('events.title')}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                  {t('events.description')}
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2 text-sm text-white/80 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{events.filter(e => new Date(e.start_date) >= new Date()).length} {t('events.upcoming')} {t('events.events')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-2 overflow-x-auto scrollbar-hide py-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`relative py-4 px-6 lg:px-8 font-semibold text-sm lg:text-base whitespace-nowrap transition-all duration-300 rounded-xl ${
                activeTab === 'upcoming'
                  ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔮</span>
                <span>{t('events.upcoming')}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === 'upcoming' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {events.filter(e => new Date(e.start_date) >= new Date()).length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`relative py-4 px-6 lg:px-8 font-semibold text-sm lg:text-base whitespace-nowrap transition-all duration-300 rounded-xl ${
                activeTab === 'past'
                  ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">📚</span>
                <span>{t('events.past')}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === 'past' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {events.filter(e => new Date(e.start_date) < new Date()).length}
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 max-w-lg mx-auto border border-gray-100">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                {/* Animated icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg animate-pulse">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                  {activeTab === 'upcoming' ? t('events.noUpcoming') : t('events.noPast')}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 leading-relaxed">
                  {activeTab === 'upcoming' ? t('events.checkBackLater') : t('events.noPastEvents')}
                </p>
                
                {/* Call to action */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setActiveTab(activeTab === 'upcoming' ? 'past' : 'upcoming')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {activeTab === 'upcoming' ? `📚 ${t('events.viewPast')}` : `🔮 ${t('events.viewUpcoming')}`}
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    🏠 {t('common.backToHome')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on image */}
                <div className="relative h-40 sm:h-48 lg:h-56 xl:h-64 overflow-hidden">
                  <img 
                    src={event.image ? event.image : "/images/food-for-talk.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Event type badge with enhanced styling */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${getEventTypeColor(event.event_type)}`}>
                      {getEventTypeLabel(event.event_type)}
                    </span>
                  </div>
                  
                  {/* Registration count badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                      <span className="text-xs font-semibold text-gray-700">
                        {event.registrations_count || 0} {t('events.registered')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6 sm:p-8 lg:p-10">
                  {/* Event Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 sm:mb-6 line-clamp-2 leading-tight">
                    {event.title}
                  </h3>

                  {/* Event Description */}
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center text-sm sm:text-base text-gray-700">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium">{formatDate(event.start_date)}</span>
                      </div>
                      <div className="flex items-center text-sm sm:text-base text-gray-700">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mr-3 flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">{formatTime(event.start_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-sm sm:text-base text-gray-700">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mr-3 flex-shrink-0">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="font-medium">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {user ? (
                      isUserRegistered(event.id) ? (
                        <button
                          onClick={() => handleCancelRegistration(event.id)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-sm sm:text-base font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>{t('events.cancelRegistration')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegisterForEvent(event.id)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-sm sm:text-base font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>{t('events.register')}</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-sm sm:text-base font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>{t('events.loginToRegister')}</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventOverlay(true);
                      }}
                      className="px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-xl text-sm sm:text-base font-bold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('events.details')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Details Overlay */}
      <EventDetailsOverlay
        event={selectedEvent}
        isOpen={showEventOverlay}
        onClose={() => setShowEventOverlay(false)}
        onRegistrationChange={() => {
          fetchUserRegistrations();
          fetchEvents();
        }}
      />
    </div>
  );
};

export default EventsPage; 