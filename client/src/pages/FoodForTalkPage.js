import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import CountdownTimer from '../components/food-for-talk/CountdownTimer';
import EventDetails from '../components/food-for-talk/EventDetails';
import RegisterButton from '../components/food-for-talk/RegisterButton';
import ActionButtons from '../components/food-for-talk/ActionButtons';
import apiService from '../services/api';

const FoodForTalkPage = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [eventSettings, setEventSettings] = useState({
    event_start_date: null,
    countdown_header_text: '距離活動開始還有',
    is_event_active: false,
    show_countdown: false,
    event_status: 'upcoming'
  });
  const [loading, setLoading] = useState(true);

  // Fetch event settings from database
  useEffect(() => {
    const fetchEventSettings = async () => {
      try {
        const response = await apiService.get('/super-admin/food-for-talk/public/event-settings');
        if (response.success) {
          setEventSettings(response.settings);
        }
      } catch (error) {
        console.error('Failed to fetch event settings:', error);
        // Use default settings if API fails
        setEventSettings({
          event_start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          countdown_header_text: '距離活動開始還有',
          is_event_active: true,
          show_countdown: true,
          event_status: 'upcoming'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventSettings();
  }, []);

  // Set event date from database or default
  const eventDate = useMemo(() => {
    if (eventSettings.event_start_date) {
      return new Date(eventSettings.event_start_date);
    }
    // Fallback to 30 days from now if no date set
    const date = new Date();
    date.setDate(date.getDate() + 30);
    date.setHours(19, 0, 0, 0); // 7 PM
    return date;
  }, [eventSettings.event_start_date]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/web bg3.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        <div className="relative z-20 text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/web bg3.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Header */}
      <header className="relative z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-white text-xl font-bold hover:text-yellow-400 transition-colors">
                PersonaCentric
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="text-white/70 hover:text-white transition-colors px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
              >
                {language === 'zh-TW' ? 'EN' : '中文'}
              </button>
              <RegisterButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-400/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full animate-ping"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/images/High Tea or Me.png" 
              alt="High Tea or Me Logo" 
              className="mx-auto h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 object-contain"
            />
          </div>
          
          {/* Event Title */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4">
              {t('foodForTalk.title')}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-yellow-400 font-semibold">
              {t('foodForTalk.subtitle')}
            </p>
          </div>

          {/* Countdown Timer or Event Status Message */}
          {eventSettings.show_countdown && eventSettings.is_event_active && (
            <div className="mb-12">
              <CountdownTimer 
                timeLeft={timeLeft} 
                headerText={eventSettings.countdown_header_text}
              />
            </div>
          )}
          
          {/* Event Status Messages */}
          {!eventSettings.is_event_active && (
            <div className="mb-12">
              <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl p-6 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                  Event Currently Inactive
                </h2>
                <p className="text-white/80">
                  This event is currently not active. Please check back later.
                </p>
              </div>
            </div>
          )}
          
          {eventSettings.event_status === 'completed' && (
            <div className="mb-12">
              <div className="bg-green-400/20 border border-green-400/30 rounded-xl p-6 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                  Event Completed
                </h2>
                <p className="text-white/80">
                  Thank you for participating in our Food for Talk event!
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-16">
            <ActionButtons />
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="relative z-20 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventDetails />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-black/30 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70">
            © 2024 PersonaCentric. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FoodForTalkPage;
