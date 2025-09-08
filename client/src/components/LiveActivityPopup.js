import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LiveActivityPopup = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  // Live activity data
  const activities = [
    t('about.liveActivity.member1'),
    t('about.liveActivity.member2'),
    t('about.liveActivity.member3'),
    t('about.liveActivity.member4'),
    t('about.liveActivity.member5'),
    t('about.liveActivity.member6'),
  ];

  useEffect(() => {
    // Show popup after 2 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Rotate through activities and auto-dismiss
    const interval = setInterval(() => {
      setCurrentActivityIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % activities.length;
        
        // If we've completed one full cycle, hide the popup
        if (nextIndex === 0) {
          setIsVisible(false);
          return 0;
        }
        
        return nextIndex;
      });
    }, 7000); // Change activity every 7 seconds

    return () => clearInterval(interval);
  }, [isVisible, activities.length]);

  // Auto-hide popup after 30 seconds total
  useEffect(() => {
    if (!isVisible) return;

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 30000);

    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-2xl p-4 max-w-sm border border-white/20 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">{t('about.liveActivity.title')}</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-90 animate-fade-in">
            {activities[currentActivityIndex]}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LiveActivityPopup;
