import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollingGifts from '../components/ScrollingGifts';
import ScrollingEvents from '../components/ScrollingEvents';

const HomePage = () => {
  const { t } = useLanguage();
  const sectionRefs = useRef([]);

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);








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


  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with Animations */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen w-full flex items-center justify-center overflow-hidden -mt-16">
        <div className="absolute inset-0">
          {/* Background Image with Parallax Effect */}
          <div className="absolute inset-0">
            <img 
              src={`/images/food-for-talk.jpg?t=${Date.now()}`} 
              alt="Food for Talk Event"
              className="w-full h-full object-cover transform scale-105 animate-float"
            />
            {/* Enhanced gradient overlay with animated elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            {/* Floating particles effect */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping opacity-40"></div>
              <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-50"></div>
            </div>
          </div>
          
          {/* Content with Enhanced Animations */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-12 sm:pb-16 px-3 sm:px-4">
            {/* Animated title */}
            <div className="mb-6 sm:mb-8 animate-fade-in-up">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
                {t('home.hero.title')}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl animate-fade-in-up-delay">
                {t('home.hero.eventDate')}
              </p>
            </div>
            
            {/* Enhanced CTA Button */}
            <Link
              to="/register"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-500 transform hover:scale-110 flex items-center justify-center overflow-hidden animate-fade-in-up-delay-2"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span className="relative inline-flex items-center text-white z-10">
                {t('home.hero.registerNow')}
                <svg 
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced with Animations */}
      <section 
        ref={(el) => (sectionRefs.current[0] = el)}
        className="py-12 sm:py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 lg:mb-4 text-white">
              {t('home.about.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-blue-200 max-w-3xl mx-auto">
              {t('home.about.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Smart Matching */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 border border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                    {t('home.about.benefit1.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                    {t('home.about.benefit1.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Community */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 border border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">👥</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                    {t('home.about.benefit2.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                    {t('home.about.benefit2.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Reward System */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 border border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                    {t('home.about.benefit3.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                    {t('home.about.benefit3.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Continuous Learning */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 border border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">📚</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                    {t('home.about.benefit4.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                    {t('home.about.benefit4.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Game Section - Enhanced */}
      <section 
        ref={(el) => (sectionRefs.current[1] = el)}
        className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-100/30 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Left side - Text and CTA */}
            <div className="w-1/2 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('home.gifts.title')}
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                {t('home.gifts.description')}
              </p>
              <Link
                to="/register"
                className="group w-full sm:w-auto inline-flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
              >
                <span className="flex items-center">
                  {t('home.gifts.participate')}
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Right side - Scrolling gifts */}
            <div className="w-1/2 h-[300px] sm:h-[400px] transform hover:scale-105 transition-transform duration-500">
              <ScrollingGifts />
            </div>
          </div>
        </div>
      </section>



      {/* Events Section - Enhanced */}
      <section 
        ref={(el) => (sectionRefs.current[2] = el)}
        className="py-12 sm:py-16 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-100/30 to-transparent rounded-full -translate-y-32 -translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full translate-y-24 translate-x-24"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Left side - Text and CTA */}
            <div className="w-1/2 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {t('home.events.title')}
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                {t('home.events.description')}
              </p>
              <Link
                to="/events"
                className="group w-full sm:w-auto inline-flex justify-center items-center bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25"
              >
                <span className="flex items-center">
                  {t('home.events.cta')}
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Right side - Scrolling events */}
            <div className="w-1/2 h-[300px] sm:h-[400px] transform hover:scale-105 transition-transform duration-500">
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
          
          {/* Responsive grid: Mobile: 5 per row, Tablet: 4 per row, Desktop: 6 per row */}
          <div className="grid grid-cols-5 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 lg:gap-6">
            {[...Array(26)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-2 sm:p-3 lg:p-4 flex items-center justify-center hover:shadow-lg transition-all duration-300 group hover:scale-105 border border-gray-100"
              >
                <img
                  src={`/images/PC partners/logo_${index.toString().padStart(2, '0')}.jpg`}
                  alt={`Partner ${index + 1}`}
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                  style={{
                    maxHeight: '40px',
                    maxWidth: '80px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-xs font-medium"
                  style={{ display: 'none' }}
                >
                  Logo {index + 1}
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
          
          {/* Horizontal scrolling container for mobile */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-4 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8 xl:gap-12 hide-scrollbar">
              {blogPosts.map((post, index) => (
                <div key={post.id} className="flex-none w-[85vw] sm:w-auto bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
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
          </div>

          {/* Add custom scrollbar styles */}
          <style jsx>{`
            .hide-scrollbar {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div className="text-center mt-8 sm:mt-12 lg:mt-16">
            <Link
              to="/blogs"
              className="inline-block bg-black text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-gray-800 transition-all duration-300"
            >
              {t('blogs.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Become a Member Section - Enhanced */}
      <section 
        ref={(el) => (sectionRefs.current[3] = el)}
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-400/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-400/5 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
              {t('member.title')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-200 leading-relaxed mb-8 sm:mb-10 lg:mb-12">
              {t('member.subtitle')}
            </p>
            <Link
              to="/register"
              className="group inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 rounded-xl text-sm sm:text-base lg:text-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/25"
            >
              <span className="flex items-center justify-center">
                {t('member.cta')}
                <svg className="ml-2 w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1.05); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up-delay {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up-delay-2 {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up-delay 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up-delay-2 0.8s ease-out 0.4s both;
        }
        
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage; 