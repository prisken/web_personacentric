import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

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
      {/* Hero Section - extends into header area */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16 pt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroSlides[currentSlide].bgImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-12 h-12 lg:w-20 lg:h-20 bg-orange-500 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-40 right-20 w-10 h-10 lg:w-16 lg:h-16 bg-blue-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-8 h-8 lg:w-12 lg:h-12 bg-green-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 animate-fade-in leading-tight">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 lg:mb-10 animate-slide-up px-2 sm:px-4 lg:px-8 leading-relaxed">
            {heroSlides[currentSlide].subtitle}
          </p>
          <div className="flex justify-center">
            <Link
              to={heroSlides[currentSlide].ctaLink}
              className="bg-orange-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {heroSlides[currentSlide].cta}
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-110' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Small CTA Section - fixed text on one line */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 leading-tight">
            {t('home.getRightAgent')}
          </h2>
          <Link
            to="/agent-matching"
            className="inline-block bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t('smallCTA.button')}
          </Link>
        </div>
      </section>

      {/* Proof of Concept - Statistics with CTA - Compact Version */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
              {t('home.proofOfConcept')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.realResults')}
            </p>
          </div>
          
          {/* Mobile: Single row layout, Desktop: Grid layout */}
          <div className="flex flex-row overflow-x-auto gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10 pb-2 lg:grid lg:grid-cols-3 lg:overflow-x-visible">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group flex-shrink-0 w-48 sm:w-56 lg:w-auto lg:flex-shrink">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stat.number}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-chart-line text-white text-xs"></i>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.label}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Become a Member CTA */}
          <div className="text-center">
            <Link
              to="/pricing"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
              {t('events.title')}
            </h2>
          </div>
          
          {/* Mobile: 2 columns, Tablet: 3 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {events.map((event, index) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                <div className="h-32 sm:h-40 lg:h-48 xl:h-56 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
                  <h3 className="text-sm sm:text-base lg:text-xl xl:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">{event.title}</h3>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-3 sm:mb-4 lg:mb-6 xl:mb-8">{event.date}</p>
                  <Link
                    to="/events"
                    className={`inline-block px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 xl:px-8 xl:py-4 rounded-xl text-xs sm:text-sm lg:text-base xl:text-lg font-semibold transition-all duration-300 ${
                      event.status === 'upcoming' 
                        ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {event.status === 'upcoming' ? t('events.registerNow') : t('events.revisit')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12 lg:mt-16">
            <Link
              to="/events"
              className="inline-block bg-white text-orange-600 px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('events.viewAll')}
            </Link>
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
                    className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm lg:text-base xl:text-lg transition-all duration-200 hover:translate-x-1 inline-block"
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
              className="inline-block bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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