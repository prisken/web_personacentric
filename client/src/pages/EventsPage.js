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

  const upcomingEvents = events.filter(event => new Date(event.start_date) > new Date());
  const pastEvents = events.filter(event => new Date(event.start_date) <= new Date());

  const categories = language === 'zh-TW' 
    ? ['全部', '工作坊', '研討會', '大師班', '論壇', '網路研討會']
    : ['All', 'Workshop', 'Seminar', 'Masterclass', 'Forum', 'Webinar'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('nav.events')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {language === 'zh-TW'
              ? '參加我們專家主導的活動，提升您的財務知識並與行業專業人士建立聯繫。'
              : 'Join our expert-led events to enhance your financial knowledge and connect with industry professionals.'
            }
          </p>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event Tabs */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('events.upcoming')}
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('events.past')}
              </button>
            </div>
          </div>

          {/* Event Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {language === 'zh-TW' ? '載入中...' : 'Loading...'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event) => (
                <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-600">
                        {getEventTypeLabel(event.event_type)}
                      </span>
                      {activeTab === 'upcoming' && (
                        <span className="text-sm text-gray-500">
                          {event.price ? `$${event.price}` : (language === 'zh-TW' ? '免費' : 'Free')}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-calendar mr-2"></i>
                        {formatDate(event.start_date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-clock mr-2"></i>
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        {event.location || (language === 'zh-TW' ? '線上活動' : 'Virtual Event')}
                      </div>
                    </div>

                    {activeTab === 'upcoming' ? (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'zh-TW' ? '已註冊：' : 'Registered:'}
                          </span>
                          <span className="font-semibold">
                            {event.current_participants || 0}/{event.max_participants || '∞'}
                          </span>
                        </div>
                        {event.max_participants && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${((event.current_participants || 0) / event.max_participants) * 100}%` }}
                            ></div>
                          </div>
                        )}
                        {user ? (
                          isUserRegistered(event.id) ? (
                            <button 
                              onClick={() => handleCancelRegistration(event.id)}
                              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                            >
                              {language === 'zh-TW' ? '取消註冊' : 'Cancel Registration'}
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRegisterForEvent(event.id)}
                              disabled={event.max_participants && (event.current_participants || 0) >= event.max_participants}
                              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {event.max_participants && (event.current_participants || 0) >= event.max_participants
                                ? (language === 'zh-TW' ? '已滿額' : 'Full')
                                : (language === 'zh-TW' ? '立即註冊' : 'Register Now')
                              }
                            </button>
                          )
                        ) : (
                          <button 
                            onClick={() => alert(language === 'zh-TW' ? '請先登入' : 'Please login first')}
                            className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold cursor-not-allowed"
                          >
                            {language === 'zh-TW' ? '請先登入' : 'Login Required'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'zh-TW' ? '參與者：' : 'Attendees:'}
                          </span>
                          <span className="font-semibold">{event.current_participants || 0}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedEvent(event)}
                          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                        >
                          {language === 'zh-TW' ? '查看詳情' : 'View Details'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && (activeTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {language === 'zh-TW' ? '暫無活動' : 'No Events'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'upcoming' 
                  ? (language === 'zh-TW' ? '目前沒有即將舉行的活動' : 'No upcoming events at the moment')
                  : (language === 'zh-TW' ? '沒有過去的活動記錄' : 'No past events found')
                }
              </p>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              {language === 'zh-TW' ? '載入更多活動' : 'Load More Events'}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'zh-TW' ? '保持更新' : 'Stay Updated'}
          </h2>
          <p className="text-xl mb-8">
            {language === 'zh-TW'
              ? '獲取即將舉行的活動和獨家內容的通知'
              : 'Get notified about upcoming events and exclusive content'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={language === 'zh-TW' ? '輸入您的電子郵件' : 'Enter your email'}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              {language === 'zh-TW' ? '訂閱' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage; 