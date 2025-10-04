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
      <div className="min-h-screen relative overflow-hidden -mt-16 lg:-mt-20 flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover md:object-contain z-0"
        >
          <source src="/videos/web bg3.mp4" type="video/mp4" />
        </video>
        
        {/* Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center z-[15]">
          <img 
            src="/images/High Tea or Me.png?v=3" 
            alt="High Tea or Me Logo" 
            className="h-28 sm:h-40 md:h-48 lg:h-56 xl:h-64 2xl:h-[20rem] object-contain"
          />
        </div>
        
        {/* Light overlay */}
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        
        <div className="relative z-20 text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden -mt-16 lg:-mt-20">
      {/* Remove in-page header; rely on global header in App */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Local Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-sm"
        >
          {language === 'zh-TW' ? 'EN' : '中文'}
        </button>
        {/* Video Background (scoped to hero only) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover md:object-contain object-top z-0"
        >
          <source src="/videos/web bg3.mp4" type="video/mp4" />
        </video>
        {/* Light overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10 z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo as first element */}
          <div className="pt-20 sm:pt-24 mb-0 sm:mb-2 -mb-8 sm:-mb-10 md:-mb-12 lg:-mb-14">
            <img 
              src="/images/High Tea or Me.png?v=3" 
              alt="High Tea or Me Logo" 
              className="block mx-auto h-[24vh] sm:h-48 md:h-64 lg:h-[22rem] xl:h-[26rem] 2xl:h-[28rem] object-contain"
            />
          </div>

          {/* Primary CTA Buttons: Register (emphasized) above Info */}
          <div className="-mt-10 sm:-mt-8 md:-mt-10 lg:-mt-12 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
            {/* Emphasized Register Button */}
            <RegisterButton />
          </div>

          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
            {/* Info Button - scroll to event info */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('event-info');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="group relative w-auto mx-auto px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-white/30 bg-white/10 hover:bg-white/20 text-sm"
            >
              <span className="relative z-10 flex items-center">
                Information
                <svg 
                  className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/10 to-white/10"></div>
            </button>
          </div>

          {/* Countdown Timer or Event Status Message */}
          {eventSettings.show_countdown && eventSettings.is_event_active && (
            <div className="mb-8 sm:mb-10">
              <CountdownTimer 
                timeLeft={timeLeft} 
                headerText={eventSettings.countdown_header_text}
              />
            </div>
          )}

          {/* Secondary Buttons: See Participants + Enter Secret Chat */}
          <div className="mb-12 sm:mb-16">
            <ActionButtons />
          </div>

          {/* Sponsors / Partners */}
          <section className="mb-12 sm:mb-16">
            <div className="max-w-5xl mx-auto px-4">
              {/* Organizer */}
              <div className="text-center mb-6">
                <div className="text-white/70 text-xs tracking-widest uppercase mb-3">Organizer</div>
                <div className="flex justify-center">
                  <img
                    src="/images/sd-logos/honor.png"
                    alt="Honor District - Organizer"
                    className="h-10 sm:h-12 md:h-14 object-contain"
                  />
                </div>
              </div>

              {/* Sponsors grid */}
              <div className="grid grid-cols-3 gap-6 items-center">
                <div className="text-center">
                  <div className="text-white/70 text-[10px] uppercase tracking-wider mb-2">Location</div>
                  <img
                    src="/images/sd-logos/ippaiki.png"
                    alt="IPPAIKI - Location Sponsor"
                    className="mx-auto h-8 sm:h-10 md:h-12 object-contain"
                  />
                </div>
                <div className="text-center">
                  <div className="text-white/70 text-[10px] uppercase tracking-wider mb-2">Drinks</div>
                  <img
                    src="/images/sd-logos/one-half.png"
                    alt="One Half Dessert - Drink Sponsor"
                    className="mx-auto h-8 sm:h-10 md:h-12 object-contain"
                  />
                </div>
                <div className="text-center">
                  <div className="text-white/70 text-[10px] uppercase tracking-wider mb-2">Media</div>
                  <img
                    src="/images/sd-logos/persona-centric.png"
                    alt="Persona Centric - Media Sponsor"
                    className="mx-auto h-8 sm:h-10 md:h-12 object-contain"
                  />
                </div>
              </div>
            </div>
          </section>
          
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
        </div>
      </section>

      {/* Event Details Section */}
      <section className="relative z-20 py-16 bg-black/70">
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
