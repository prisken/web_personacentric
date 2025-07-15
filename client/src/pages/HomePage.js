import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero carousel data with single CTAs
  const heroSlides = [
    {
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      cta: t('hero.eventCTA'),
      ctaLink: '/events',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      bgColor: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Find Your Perfect Financial Advisor',
      subtitle: 'AI-powered matching to connect you with the right professional',
      cta: t('hero.pairingCTA'),
      ctaLink: '/pricing',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      bgColor: 'from-green-600 to-blue-600'
    },
    {
      title: 'AI Content Creation in 2 Minutes',
      subtitle: 'Generate professional financial content instantly',
      cta: t('hero.aiCTA'),
      ctaLink: '/ai-trial',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      bgColor: 'from-orange-600 to-red-600'
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
    { number: '30', label: t('stats.agents'), description: 'Active financial advisors' },
    { number: '1,250+', label: t('stats.clients'), description: 'Successful clients served' },
    { number: '85%', label: t('stats.growth'), description: 'Average investment growth' }
  ];

  // Add carousel state for contest winners and testimonials
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Contest winners data (replace with real data as needed)
  const contestWinners = [
    {
      type: 'Social Media Post',
      icon: 'fas fa-share-alt',
      bg: 'from-blue-500 to-purple-600',
      content: 'Best viral post about financial literacy',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'Blog Article',
      icon: 'fas fa-blog',
      bg: 'from-green-500 to-blue-600',
      content: 'Insightful blog on investment strategies',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'Poster Design',
      icon: 'fas fa-image',
      bg: 'from-orange-500 to-red-600',
      content: 'Creative poster for retirement planning',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'Video Content',
      icon: 'fas fa-video',
      bg: 'from-purple-500 to-pink-600',
      content: 'Engaging video on insurance basics',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    },
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
      title: 'Financial Planning Workshop',
      date: 'March 15, 2024',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      status: 'upcoming'
    },
    {
      title: 'Investment Strategy Seminar',
      date: 'March 10, 2024',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      status: 'past'
    },
    {
      title: 'Retirement Planning Masterclass',
      date: 'March 20, 2024',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      status: 'upcoming'
    }
  ];

  // Blog posts data
  const blogPosts = [
    {
      title: 'Investment Strategies for 2024',
      excerpt: 'Discover the top investment strategies that will dominate the financial landscape this year.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      date: 'March 12, 2024'
    },
    {
      title: 'Understanding Insurance Policies',
      excerpt: 'A comprehensive guide to choosing the right insurance coverage for your needs.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      date: 'March 10, 2024'
    },
    {
      title: 'Retirement Planning Essentials',
      excerpt: 'Start planning your retirement today with these essential strategies and tips.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      date: 'March 8, 2024'
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
          style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-12 h-12 md:w-20 md:h-20 bg-orange-500 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-40 right-20 w-10 h-10 md:w-16 md:h-16 bg-blue-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-8 h-8 md:w-12 md:h-12 bg-green-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 animate-fade-in leading-tight">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 animate-slide-up px-2">
            {heroSlides[currentSlide].subtitle}
          </p>
          <div className="flex justify-center">
            <Link
              to={heroSlides[currentSlide].ctaLink}
              className="bg-orange-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-orange-700 transition-colors duration-200 transform hover:scale-105"
            >
              {heroSlides[currentSlide].cta}
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Small CTA Section - fixed text on one line */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Get the right agent and double your investment!
          </h2>
          <Link
            to="/agent-matching"
            className="inline-block bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
          >
            {t('smallCTA.button')}
          </Link>
        </div>
      </section>

      {/* Proof of Concept - Statistics with CTA */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proof of Concept
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Real results from our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center">
                    <span className="text-2xl md:text-4xl font-bold text-white">{stat.number}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-chart-line text-white text-xs md:text-sm"></i>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-sm md:text-base text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Become a Member CTA */}
          <div className="text-center">
            <Link
              to="/pricing"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      {/* AI Content Creation Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('ai.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Lifestyle Selector */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  {t('ai.industrySelector')}
                </h3>
                <select className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {lifestyleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <Link
                  to="/ai-trial"
                  className="mt-4 md:mt-6 inline-block bg-orange-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-orange-700 transition-colors duration-200 w-full text-center"
                >
                  {t('ai.tryButton')}
                </Link>
              </div>
            </div>

            {/* Contest Winners Showcase */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 flex flex-col items-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
                {t('ai.contestWinner')}
              </h3>
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
                <div className={`bg-gradient-to-br ${contestWinners[winnerIndex].bg} rounded-lg p-4 text-white w-full flex flex-col items-center transition-all duration-500`}>
                  <img src={contestWinners[winnerIndex].image} alt={contestWinners[winnerIndex].type} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg mb-2" />
                  <i className={`${contestWinners[winnerIndex].icon} text-xl md:text-2xl mb-2`}></i>
                  <p className="text-sm md:text-base lg:text-lg font-semibold mb-1 text-center">{contestWinners[winnerIndex].type}</p>
                  <p className="text-xs md:text-sm lg:text-base text-white/80 text-center">{contestWinners[winnerIndex].content}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  {contestWinners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setWinnerIndex(idx)}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${idx === winnerIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <Link
                to="/contests"
                className="mt-4 md:mt-6 inline-block text-blue-600 hover:text-blue-700 font-semibold text-sm md:text-base"
              >
                {t('ai.viewAllWinners')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl bg-gray-50 rounded-lg p-6 md:p-8 shadow-lg transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {getCurrentTestimonials().map((testimonial, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center mb-3 md:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star text-yellow-400 text-xs md:text-sm"></i>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-3 md:mb-4 italic text-xs md:text-sm lg:text-base leading-relaxed">"{testimonial.quote}"</p>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base lg:text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-xs md:text-sm">{testimonial.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              {[...Array(totalSlides)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${idx === testimonialIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 md:py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('events.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-40 md:h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">{event.date}</p>
                  <Link
                    to="/events"
                    className={`inline-block px-4 py-2 md:px-6 md:py-2 rounded-lg text-sm md:text-base font-semibold transition-colors duration-200 ${
                      event.status === 'upcoming' 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {event.status === 'upcoming' ? t('events.registerNow') : t('events.revisit')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 md:mt-8">
            <Link
              to="/events"
              className="inline-block bg-white text-orange-600 px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              {t('events.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Partnering Organizations */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('partners.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 md:p-6 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-xs md:text-sm">Partner {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('blogs.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-40 md:h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">{post.excerpt}</p>
                  <p className="text-xs md:text-sm text-gray-500 mb-4">{post.date}</p>
                  <Link
                    to="/blogs"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm md:text-base"
                  >
                    {t('blogs.readMore')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 md:mt-8">
            <Link
              to="/blogs"
              className="inline-block bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              {t('blogs.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-300">
              Get in touch with us for any questions or support
            </p>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder={t('contact.name')}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder={t('contact.phone')}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              type="email"
              placeholder={t('contact.email')}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder={t('contact.message')}
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
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