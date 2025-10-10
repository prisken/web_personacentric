/**
 * Analytics Service
 * Tracks user behavior and sends to Google Analytics and backend
 */

class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = Date.now();
    this.scrollThresholds = new Set(); // Track which scroll depths we've already logged
    this.isInitialized = false;
  }

  /**
   * Initialize analytics service
   */
  initialize() {
    if (this.isInitialized) return;
    
    // Set up scroll tracking
    this.setupScrollTracking();
    
    // Set up page visibility tracking
    this.setupVisibilityTracking();
    
    this.isInitialized = true;
    console.log('📊 Analytics Service Initialized');
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track page view
   */
  trackPageView(pageName, properties = {}) {
    console.log('📊 Page View:', pageName, properties);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...properties
      });
    }

    // Send to backend
    this.sendToBackend('page_view', {
      page: pageName,
      ...properties
    });
  }

  /**
   * Track button clicks
   */
  trackButtonClick(buttonName, location, properties = {}) {
    console.log('🖱️ Button Click:', buttonName, 'at', location);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'button_click', {
        button_name: buttonName,
        button_location: location,
        ...properties
      });
    }

    // Send to backend
    this.sendToBackend('button_click', {
      button_name: buttonName,
      location: location,
      ...properties
    });
  }

  /**
   * Track registration funnel steps
   */
  trackRegistrationStep(step, data = {}) {
    console.log('📝 Registration Step:', step, data);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'registration_step', {
        step_name: step,
        ...data
      });
    }

    // Send to backend
    this.sendToBackend('registration_step', {
      step: step,
      ...data
    });
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage) {
    // Only track each threshold once per session
    if (this.scrollThresholds.has(percentage)) {
      return;
    }
    
    this.scrollThresholds.add(percentage);
    console.log('📜 Scroll Depth:', percentage + '%');
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'scroll_depth', {
        percentage: percentage
      });
    }

    // Send to backend
    this.sendToBackend('scroll_depth', {
      percentage: percentage
    });
  }

  /**
   * Track time on page (call on unmount)
   */
  trackTimeOnPage(pageName) {
    const timeSpent = Math.round((Date.now() - this.pageLoadTime) / 1000);
    console.log('⏱️ Time on Page:', pageName, timeSpent, 'seconds');
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'time_on_page', {
        page_name: pageName,
        time_seconds: timeSpent
      });
    }

    // Send to backend
    this.sendToBackend('time_on_page', {
      page: pageName,
      time_seconds: timeSpent
    });
  }

  /**
   * Track form interactions
   */
  trackFormEvent(formName, eventType, fieldName = null) {
    console.log('📋 Form Event:', formName, eventType, fieldName || '');
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', `form_${eventType}`, {
        form_name: formName,
        field_name: fieldName
      });
    }

    // Send to backend
    this.sendToBackend('form_event', {
      form_name: formName,
      event_type: eventType,
      field_name: fieldName
    });
  }

  /**
   * Track video interactions
   */
  trackVideoEvent(action) {
    console.log('🎥 Video Event:', action);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'video_interaction', {
        action: action
      });
    }

    // Send to backend
    this.sendToBackend('video_interaction', {
      action: action
    });
  }

  /**
   * Track language toggle
   */
  trackLanguageToggle(fromLang, toLang) {
    console.log('🌐 Language Toggle:', fromLang, '→', toLang);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'language_toggle', {
        from_language: fromLang,
        to_language: toLang
      });
    }

    // Send to backend
    this.sendToBackend('language_toggle', {
      from_language: fromLang,
      to_language: toLang
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(eventName, value = 0, properties = {}) {
    console.log('🎯 Conversion:', eventName, 'Value:', value);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, {
        value: value,
        currency: 'HKD',
        ...properties
      });
    }

    // Send to backend
    this.sendToBackend('conversion', {
      event_name: eventName,
      value: value,
      ...properties
    });
  }

  /**
   * Track user engagement
   */
  trackEngagement(action, details = {}) {
    console.log('👤 Engagement:', action, details);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'engagement', {
        action: action,
        ...details
      });
    }

    // Send to backend
    this.sendToBackend('engagement', {
      action: action,
      ...details
    });
  }

  /**
   * Setup scroll tracking
   */
  setupScrollTracking() {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

      // Track at 25%, 50%, 75%, 100%
      if (scrollPercentage >= 25 && scrollPercentage < 50) {
        this.trackScrollDepth(25);
      } else if (scrollPercentage >= 50 && scrollPercentage < 75) {
        this.trackScrollDepth(50);
      } else if (scrollPercentage >= 75 && scrollPercentage < 100) {
        this.trackScrollDepth(75);
      } else if (scrollPercentage >= 100) {
        this.trackScrollDepth(100);
      }
    };

    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 250);
    });
  }

  /**
   * Setup page visibility tracking
   */
  setupVisibilityTracking() {
    let visibilityStartTime = Date.now();
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const timeVisible = Date.now() - visibilityStartTime;
        this.trackEngagement('page_hidden', { time_visible_ms: timeVisible });
      } else {
        visibilityStartTime = Date.now();
        this.trackEngagement('page_visible');
      }
    });
  }

  /**
   * Send event to backend API
   */
  async sendToBackend(eventType, data) {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          event_type: eventType,
          event_data: data,
          timestamp: new Date().toISOString(),
          page_url: window.location.href,
          page_path: window.location.pathname,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        })
      });

      if (!response.ok) {
        console.warn('Analytics tracking failed:', response.statusText);
      }
    } catch (error) {
      // Silent fail - don't disrupt user experience
      console.warn('Analytics tracking error:', error.message);
    }
  }

  /**
   * Reset session (call on page navigation)
   */
  resetSession() {
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = Date.now();
    this.scrollThresholds.clear();
    console.log('🔄 Analytics Session Reset');
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
