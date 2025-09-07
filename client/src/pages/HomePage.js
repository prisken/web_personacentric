import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollingGifts from '../components/ScrollingGifts';
import ScrollingEvents from '../components/ScrollingEvents';

const HomePage = () => {
  const { t } = useLanguage();








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
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen w-full flex items-center justify-center overflow-hidden -mt-16">
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
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-12 sm:pb-16 px-3 sm:px-4">
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl">
              {t('home.hero.eventDate')}
            </p>
            {/* CTA Button */}
            <Link
              to="/register"
              className="group relative w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center overflow-hidden"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.8)',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span className="relative inline-flex items-center text-white">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4">🎯</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">
                    {t('home.about.benefit1.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200">
                    {t('home.about.benefit1.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Community */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4">👥</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">
                    {t('home.about.benefit2.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200">
                    {t('home.about.benefit2.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Reward System */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4">🏆</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">
                    {t('home.about.benefit3.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200">
                    {t('home.about.benefit3.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Continuous Learning */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 transform hover:scale-105 transition-all duration-300 border border-yellow-500/30">
              <div className="flex items-center">
                <div className="text-yellow-500 text-2xl sm:text-3xl lg:text-4xl mr-3 sm:mr-4">📚</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">
                    {t('home.about.benefit4.title')}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-blue-200">
                    {t('home.about.benefit4.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Game Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Left side - Text and CTA */}
            <div className="w-1/2 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">{t('home.gifts.title')}</h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl">
                {t('home.gifts.description')}
              </p>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-all duration-300"
              >
                {t('home.gifts.participate')}
              </Link>
            </div>

            {/* Right side - Scrolling gifts */}
            <div className="w-1/2 h-[300px] sm:h-[400px]">
              <ScrollingGifts />
            </div>
          </div>
        </div>
      </section>



      {/* Events Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Left side - Text and CTA */}
            <div className="w-1/2 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">{t('home.events.title')}</h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl">
                {t('home.events.description')}
              </p>
              <Link
                to="/events"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-all duration-300"
              >
                {t('home.events.cta')}
              </Link>
            </div>

            {/* Right side - Scrolling events */}
            <div className="w-1/2 h-[300px] sm:h-[400px]">
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
          
          {/* Mobile: 5 per row, Tablet: 5 per row, Desktop: 5 per row */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-2 sm:p-3 flex items-center justify-center hover:bg-gray-200 transition-all duration-300 group hover:scale-105">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-lg flex items-center justify-center group-hover:bg-gray-400 transition-all duration-300">
                  <span className="text-gray-600 font-semibold text-[10px] sm:text-xs lg:text-sm">{t('partners.placeholder', { number: index + 1 })}</span>
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
              className="inline-block bg-black text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-gray-800 transition-all duration-300"
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