import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';

const EventsPage = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
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
        alert(language === 'zh-TW' ? '註冊成功！' : 'Registration successful!');
        fetchUserRegistrations();
        fetchEvents(); // Refresh events to update registration count
      }
    } catch (error) {
      alert(language === 'zh-TW' ? '註冊失敗：' + error.message : 'Registration failed: ' + error.message);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      const response = await apiService.cancelEventRegistration(eventId);
      if (response.success) {
        alert(language === 'zh-TW' ? '取消註冊成功！' : 'Registration cancelled successfully!');
        fetchUserRegistrations();
        fetchEvents(); // Refresh events to update registration count
      }
    } catch (error) {
      alert(language === 'zh-TW' ? '取消註冊失敗：' + error.message : 'Failed to cancel registration: ' + error.message);
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
    const labels = {
      workshop: language === 'zh-TW' ? '工作坊' : 'Workshop',
      seminar: language === 'zh-TW' ? '研討會' : 'Seminar',
      consultation: language === 'zh-TW' ? '諮詢' : 'Consultation',
      webinar: language === 'zh-TW' ? '網路研討會' : 'Webinar'
    };
    return labels[eventType] || eventType;
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
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
              📅 {t('events.title')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl">
              {t('events.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 lg:space-x-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-3 sm:py-4 px-3 lg:px-6 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              🔮 {t('events.upcoming')}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-3 sm:py-4 px-3 lg:px-6 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap transition-all duration-300 ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              📚 {t('events.past')}
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-gray-400 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2">
                {activeTab === 'upcoming' ? t('events.noUpcoming') : t('events.noPast')}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-500">
                {activeTab === 'upcoming' ? t('events.checkBackLater') : t('events.noPastEvents')}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105">
                {/* Event Image */}
                <div className="h-32 sm:h-40 lg:h-48 xl:h-56 overflow-hidden">
                  <img 
                    src={event.image ? event.image : "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Event Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Event Type Badge */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs lg:text-sm font-medium text-white ${getEventTypeColor(event.event_type)}`}>
                      {getEventTypeLabel(event.event_type)}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-500">
                      {event.registrations_count || 0} {t('events.registered')}
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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    {user ? (
                      isUserRegistered(event.id) ? (
                        <button
                          onClick={() => handleCancelRegistration(event.id)}
                          className="flex-1 bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {t('events.cancelRegistration')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegisterForEvent(event.id)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {t('events.register')}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="flex-1 bg-gray-600 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {t('events.loginToRegister')}
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      {t('events.details')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage; 