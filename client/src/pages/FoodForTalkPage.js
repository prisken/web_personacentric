import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import CountdownTimer from '../components/food-for-talk/CountdownTimer';
import EventDetails from '../components/food-for-talk/EventDetails';
import RegisterButton from '../components/food-for-talk/RegisterButton';
import ActionButtons from '../components/food-for-talk/ActionButtons';

const FoodForTalkPage = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set event date (example: 30 days from now)
  const eventDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    date.setHours(19, 0, 0, 0); // 7 PM
    return date;
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
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
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-400/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Event Title */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4">
              {t('foodForTalk.title')}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-yellow-400 font-semibold">
              {t('foodForTalk.subtitle')}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <CountdownTimer timeLeft={timeLeft} />
          </div>

          {/* Action Buttons */}
          <div className="mb-16">
            <ActionButtons />
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="relative py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventDetails />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-8">
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
