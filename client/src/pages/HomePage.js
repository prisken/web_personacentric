import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollingGifts from '../components/ScrollingGifts';
import ScrollingEvents from '../components/ScrollingEvents';

const HomePage = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero carousel data with single CTAs
  const heroSlides = [
    {
      id: 1,
      title: t('home.hero.slide1.title'),
      subtitle: t('home.hero.slide1.subtitle'),
      cta: t('hero.eventCTA'),
      ctaLink: '/events',
      bgImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
    },
    {
      id: 2,
      title: t('home.hero.slide2.title'),
      subtitle: t('home.hero.slide2.subtitle'),
      cta: t('hero.pairingCTA'),
      ctaLink: '/agent-matching',
      bgImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
    }
  ];

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Statistics data
  const stats = [
    { number: '30', label: t('stats.agents'), description: t('stats.activeAdvisors') },
    { number: '1,250+', label: t('stats.clients'), description: t('stats.successfulClients') },
    { number: '85%', label: t('stats.growth'), description: t('stats.averageGrowth') }
  ];

  // Add carousel state for contest winners
  const [winnerIndex, setWinnerIndex] = useState(0);

  // Contest winners data (replace with real data as needed)
  const contestWinners = [
    {
      id: 1,
      type: t('contest.winners.socialMedia'),
      icon: 'fas fa-share-alt',
      winner: 'Sarah Chen',
      content: t('contest.winners.bestViralPost'),
    },
    {
      id: 2,
      type: t('contest.winners.blogArticle'),
      icon: 'fas fa-blog',
      winner: 'Michael Wong',
      content: t('contest.winners.insightfulBlog'),
    },
    {
      id: 3,
      type: t('contest.winners.posterDesign'),
      icon: 'fas fa-image',
      winner: 'Emily Liu',
      content: t('contest.winners.creativePoster'),
    },
    {
      id: 4,
      type: t('contest.winners.videoContent'),
      icon: 'fas fa-video',
      winner: 'David Kim',
      content: t('contest.winners.engagingVideo'),
    }
  ];

  // Auto-rotate contest winners
  useEffect(() => {
    const interval = setInterval(() => {
      setWinnerIndex((prev) => (prev + 1) % contestWinners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [contestWinners.length]);

  // Events data
  const events = [
    {
      id: 1,
      title: t('events.financialPlanning'),
      date: '2024-03-15',
      location: 'Hong Kong',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: t('events.investmentStrategy'),
      date: '2024-03-20',
      location: 'Hong Kong',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      title: t('events.retirementPlanning'),
      date: '2024-03-25',
      location: 'Hong Kong',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: t('blogs.investmentStrategies2024'),
      excerpt: t('blogs.investmentStrategiesExcerpt'),
      author: 'Financial Expert',
      date: '2024-03-01',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: t('blogs.insurancePolicies'),
      excerpt: t('blogs.insurancePoliciesExcerpt'),
      author: 'Insurance Specialist',
      date: '2024-02-28',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      title: t('blogs.retirementEssentials'),
      excerpt: t('blogs.retirementEssentialsExcerpt'),
      author: 'Retirement Planner',
      date: '2024-02-25',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  // Add lifestyle options for the dropdown
  const lifestyleOptions = [
    { value: 'active', label: t('lifestyle.active') },
    { value: 'family', label: t('lifestyle.family') },
    { value: 'traveler', label: t('lifestyle.traveler') },
    { value: 'foodie', label: t('lifestyle.foodie') },
    { value: 'creative', label: t('lifestyle.creative') },
    { value: 'tech', label: t('lifestyle.tech') },
    { value: 'wellness', label: t('lifestyle.wellness') },
    { value: 'finance', label: t('lifestyle.finance') },
    { value: 'student', label: t('lifestyle.student') },
    { value: 'retiree', label: t('lifestyle.retiree') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Upcoming Event */}
      <section className="relative min-h-[80vh] sm:h-screen w-full flex items-center justify-center overflow-hidden -mt-16">
        <div className="absolute inset-0">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={`/images/food-for-talk.jpg?t=${Date.now()}`} 
              alt="Food for Talk Event"
              className="w-full h-full object-cover"
            />
            {/* Enhanced gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-20 sm:pb-16 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
              {t('home.hero.subtitle')}
            </p>
            {/* CTA Button */}
            <Link
              to="/register"
              className="group relative w-full sm:w-auto bg-gradient-to-br from-red-500 to-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center overflow-hidden"
              style={{
                boxShadow: '0 4px 0 rgb(153 27 27), 0 8px 20px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-2px)',
              }}
            >
              <span className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"></span>
              <span className="relative inline-flex items-center">
                {t('home.hero.registerNow')}
                <svg 
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white">
              {t('home.about.title')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-200 max-w-3xl mx-auto">
              {t('home.about.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Smart Matching */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="text-yellow-500 text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {t('home.about.benefit1.title')}
              </h3>
              <p className="text-sm sm:text-base text-blue-200">
                {t('home.about.benefit1.desc')}
              </p>
            </div>

            {/* Professional Community */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="text-yellow-500 text-3xl sm:text-4xl mb-3 sm:mb-4">👥</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {t('home.about.benefit2.title')}
              </h3>
              <p className="text-sm sm:text-base text-blue-200">
                {t('home.about.benefit2.desc')}
              </p>
            </div>

            {/* Reward System */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="text-yellow-500 text-3xl sm:text-4xl mb-3 sm:mb-4">🏆</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {t('home.about.benefit3.title')}
              </h3>
              <p className="text-sm sm:text-base text-blue-200">
                {t('home.about.benefit3.desc')}
              </p>
            </div>

            {/* Continuous Learning */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="text-yellow-500 text-3xl sm:text-4xl mb-3 sm:mb-4">📚</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {t('home.about.benefit4.title')}
              </h3>
              <p className="text-sm sm:text-base text-blue-200">
                {t('home.about.benefit4.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Text and CTA - Moved to top for mobile */}
            <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">{t('home.gifts.title')}</h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8">{t('home.gifts.subtitle')}</p>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-blue-700 transition-all duration-300"
              >
                {t('home.gifts.cta')}
              </Link>
            </div>

            {/* Scrolling gifts - Moved to bottom for mobile */}
            <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] order-2 lg:order-1 mt-8 lg:mt-0">
              <ScrollingGifts />
            </div>
          </div>
        </div>
      </section>

      {/* 5 Questions Section */}
      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">{t('home.match.title')}</h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8">{t('home.match.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Emoji circles */}
              {['💼', '🏠', '💰', '📈', '🎯'].map((emoji, index) => (
                <div 
                  key={index} 
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-white flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-md border-2 border-yellow-500 transform hover:scale-110 transition-transform duration-200"
                >
                  {emoji}
                </div>
              ))}
            </div>

            <Link
              to="/agent-matching"
              className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-blue-700 transition-all duration-300"
            >
              {t('home.match.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Left side - Text and CTA */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">{t('home.events.title')}</h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                {t('home.events.subtitle')}
              </p>
              <Link
                to="/events"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-blue-700 transition-all duration-300"
              >
                {t('home.events.cta')}
              </Link>
            </div>

            {/* Right side - Scrolling events */}
            <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] mt-8 lg:mt-0">
              <ScrollingEvents />
            </div>
          </div>
        </div>
      </section>

      {/* Partnering Organizations - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
              {t('partners.title')}
            </h2>
          </div>
          
          {/* Mobile: 2 rows of 4, Tablet: 2 rows of 4, Desktop: 2 rows of 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-3 sm:p-4 lg:p-6 xl:p-8 flex items-center justify-center hover:bg-gray-200 transition-all duration-300 group hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gray-300 rounded-xl flex items-center justify-center group-hover:bg-gray-400 transition-all duration-300">
                  <span className="text-gray-600 font-semibold text-xs sm:text-sm lg:text-base">Partner {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
              {t('blogs.title')}
            </h2>
          </div>
          
          {/* Mobile: 2 columns, Tablet: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {blogPosts.map((post, index) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                <div className="h-32 sm:h-40 lg:h-48 xl:h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
                  <h3 className="text-sm sm:text-base lg:text-xl xl:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">{post.title}</h3>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-2 sm:mb-3 lg:mb-4 xl:mb-6 leading-relaxed">{post.excerpt}</p>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-500 mb-3 sm:mb-4 lg:mb-6 xl:mb-8">{post.date}</p>
                  <Link
                    to="/blogs"
                    className="text-black hover:text-gray-800 font-medium text-xs sm:text-sm lg:text-base xl:text-lg transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {t('blogs.readMore')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12 lg:mt-16">
            <Link
              to="/blogs"
              className="inline-block bg-black text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-lg text-base sm:text-lg lg:text-xl font-medium hover:bg-gray-800 transition-all duration-300"
            >
              {t('blogs.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Become a Member Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8">
              {t('member.title')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-200 leading-relaxed mb-8 sm:mb-10 lg:mb-12">
              {t('member.subtitle')}
            </p>
            <Link
              to="/register"
              className="inline-block bg-black text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 rounded-lg text-base sm:text-lg lg:text-xl font-medium hover:bg-gray-800 transition-all duration-300"
            >
              {t('member.cta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 