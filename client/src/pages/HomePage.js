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
    },
    {
      id: 3,
      title: t('home.hero.slide3.title'),
      subtitle: t('home.hero.slide3.subtitle'),
      cta: t('hero.aiCTA'),
      ctaLink: '/ai-trial',
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

  // Add carousel state for contest winners and testimonials
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

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

  // Expand testimonials to 10
  const testimonials = [
    {
      quote: t('testimonials.client1'),
      name: t('testimonials.client1Name'),
      title: t('testimonials.client1Title'),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    {
      quote: t('testimonials.client2'),
      name: t('testimonials.client2Name'),
      title: t('testimonials.client2Title'),
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    {
      quote: t('testimonials.client3'),
      name: t('testimonials.client3Name'),
      title: t('testimonials.client3Title'),
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    {
      quote: t('testimonials.client4'),
      name: t('testimonials.client4Name'),
      title: t('testimonials.client4Title'),
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      quote: t('testimonials.client5'),
      name: t('testimonials.client5Name'),
      title: t('testimonials.client5Title'),
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      quote: t('testimonials.client6'),
      name: t('testimonials.client6Name'),
      title: t('testimonials.client6Title'),
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      quote: t('testimonials.client7'),
      name: t('testimonials.client7Name'),
      title: t('testimonials.client7Title'),
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      quote: t('testimonials.client8'),
      name: t('testimonials.client8Name'),
      title: t('testimonials.client8Title'),
      avatar: 'https://randomuser.me/api/portraits/men/77.jpg'
    },
    {
      quote: t('testimonials.client9'),
      name: t('testimonials.client9Name'),
      title: t('testimonials.client9Title'),
      avatar: 'https://randomuser.me/api/portraits/women/88.jpg'
    },
    {
      quote: t('testimonials.client10'),
      name: t('testimonials.client10Name'),
      title: t('testimonials.client10Title'),
      avatar: 'https://randomuser.me/api/portraits/men/99.jpg'
    },
  ];

  // Auto-rotate contest winners
  useEffect(() => {
    const interval = setInterval(() => {
      setWinnerIndex((prev) => (prev + 1) % contestWinners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [contestWinners.length]);

  // Update testimonials carousel logic to show 3 per slide
  const testimonialsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Get current testimonials for the slide
  const getCurrentTestimonials = () => {
    const startIndex = testimonialIndex * testimonialsPerSlide;
    return testimonials.slice(startIndex, startIndex + testimonialsPerSlide);
  };

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

      {/* Proof of Concept - Statistics with CTA - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
              {t('home.proofOfConcept')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              {t('home.realResults')}
            </p>
          </div>
          
          {/* Mobile: Single row layout, Desktop: Grid layout */}
          <div className="flex flex-row overflow-x-auto gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 pb-4 sm:pb-6 lg:pb-8 lg:grid lg:grid-cols-3 lg:overflow-x-visible">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group flex-shrink-0 w-64 sm:w-72 lg:w-auto lg:flex-shrink">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-36 xl:h-36 mx-auto mb-4 sm:mb-6 lg:mb-8 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white">{stat.number}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-chart-line text-white text-xs sm:text-sm lg:text-base"></i>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">{stat.label}</h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Become a Member CTA */}
          <div className="text-center">
            <Link
              to="/pricing"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      {/* AI Content Creation Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
              {t('ai.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Lifestyle Selector */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
                  {t('ai.industrySelector')}
                </h3>
                <select className="w-full p-3 sm:p-4 lg:p-5 border-2 border-gray-200 rounded-xl text-base sm:text-lg lg:text-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  {lifestyleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <Link
                  to="/ai-trial"
                  className="mt-4 sm:mt-6 lg:mt-8 inline-block bg-orange-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:bg-orange-700 transition-all duration-300 w-full text-center shadow-lg hover:shadow-xl"
                >
                  {t('ai.tryButton')}
                </Link>
              </div>
            </div>

            {/* Contest Winners Showcase */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col items-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center">
                {t('ai.contestWinner')}
              </h3>
              <div className="w-full max-w-sm lg:max-w-md flex flex-col items-center">
                <div className={`bg-gradient-to-br ${contestWinners[winnerIndex].bg} rounded-2xl p-4 sm:p-6 lg:p-8 text-white w-full flex flex-col items-center transition-all duration-500 shadow-lg`}>
                  <img src={contestWinners[winnerIndex].image} alt={contestWinners[winnerIndex].type} className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 object-cover rounded-xl mb-3 sm:mb-4 lg:mb-6 shadow-lg" />
                  <i className={`${contestWinners[winnerIndex].icon} text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 lg:mb-4`}></i>
                  <p className="text-base sm:text-lg lg:text-xl font-semibold mb-2 lg:mb-3 text-center">{contestWinners[winnerIndex].type}</p>
                  <p className="text-xs sm:text-sm lg:text-base text-white/90 text-center leading-relaxed">{contestWinners[winnerIndex].content}</p>
                </div>
                <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-6 lg:mt-8">
                  {contestWinners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setWinnerIndex(idx)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-200 ${idx === winnerIndex ? 'bg-blue-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'}`}
                    />
                  ))}
                </div>
              </div>
              <Link
                to="/contests"
                className="mt-4 sm:mt-6 lg:mt-8 inline-block text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base lg:text-lg transition-all duration-200 hover:translate-x-1"
              >
                {t('ai.viewAllWinners')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
              {t('testimonials.title')}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl bg-gray-50 rounded-2xl p-4 sm:p-8 lg:p-12 shadow-xl transition-all duration-500">
              {/* Mobile: Single column, Tablet: 2 columns, Desktop: 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
                {getCurrentTestimonials().map((testimonial, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star text-yellow-400 text-xs sm:text-sm lg:text-base"></i>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-3 sm:mb-4 lg:mb-6 italic text-sm sm:text-base lg:text-lg leading-relaxed">"{testimonial.quote}"</p>
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">{testimonial.name}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">{testimonial.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 mt-6 sm:mt-8 lg:mt-12">
              {[...Array(totalSlides)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-200 ${idx === testimonialIndex ? 'bg-blue-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
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

      {/* Contact Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8">
              {t('contact.title')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed">
              Get in touch with us for any questions or support
            </p>
          </div>
          
          <form className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <input
                type="text"
                placeholder={t('contact.name')}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 rounded-xl bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base lg:text-lg"
              />
              <input
                type="tel"
                placeholder={t('contact.phone')}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 rounded-xl bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base lg:text-lg"
              />
            </div>
            <input
              type="email"
              placeholder={t('contact.email')}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 rounded-xl bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base lg:text-lg"
            />
            <textarea
              placeholder={t('contact.message')}
              rows="6"
              className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 rounded-xl bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base lg:text-lg resize-none"
            ></textarea>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t('contact.send')}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 