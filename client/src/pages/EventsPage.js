import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const EventsPage = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      title: language === 'zh-TW' ? '財務規劃工作坊' : 'Financial Planning Workshop',
      date: 'March 15, 2024',
      time: '2:00 PM - 4:00 PM',
      location: language === 'zh-TW' ? '線上活動' : 'Virtual Event',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: language === 'zh-TW' 
        ? '學習財務規劃的基礎知識，為您的財務未來建立穩固的基礎。'
        : 'Learn the fundamentals of financial planning and how to create a solid foundation for your financial future.',
      category: language === 'zh-TW' ? '工作坊' : 'Workshop',
      price: language === 'zh-TW' ? '免費' : 'Free',
      spots: '150',
      registered: '89'
    },
    {
      id: 2,
      title: language === 'zh-TW' ? '投資策略研討會' : 'Investment Strategy Seminar',
      date: 'March 20, 2024',
      time: '6:00 PM - 8:00 PM',
      location: language === 'zh-TW' ? '市中心會議中心' : 'Downtown Conference Center',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: language === 'zh-TW'
        ? '為有經驗的投資者提供高級投資策略，優化您的投資組合。'
        : 'Advanced investment strategies for experienced investors looking to optimize their portfolio.',
      category: language === 'zh-TW' ? '研討會' : 'Seminar',
      price: '$50',
      spots: '100',
      registered: '67'
    },
    {
      id: 3,
      title: language === 'zh-TW' ? '退休規劃大師班' : 'Retirement Planning Masterclass',
      date: 'March 25, 2024',
      time: '10:00 AM - 12:00 PM',
      location: language === 'zh-TW' ? '線上活動' : 'Virtual Event',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: language === 'zh-TW'
        ? '退休規劃綜合指南，包括401(k)、IRA和社會保障策略。'
        : 'Comprehensive guide to retirement planning, including 401(k), IRA, and social security strategies.',
      category: language === 'zh-TW' ? '大師班' : 'Masterclass',
      price: '$75',
      spots: '80',
      registered: '45'
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: language === 'zh-TW' ? '稅務規劃工作坊' : 'Tax Planning Workshop',
      date: 'February 28, 2024',
      time: '2:00 PM - 4:00 PM',
      location: language === 'zh-TW' ? '線上活動' : 'Virtual Event',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      description: language === 'zh-TW'
        ? '個人和小企業主的必要稅務規劃策略。'
        : 'Essential tax planning strategies for individuals and small business owners.',
      category: language === 'zh-TW' ? '工作坊' : 'Workshop',
      attendees: '120',
      rating: 4.8
    },
    {
      id: 5,
      title: language === 'zh-TW' ? '房地產投資論壇' : 'Real Estate Investment Forum',
      date: 'February 15, 2024',
      time: '6:00 PM - 8:00 PM',
      location: language === 'zh-TW' ? '商業中心' : 'Business Center',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
      description: language === 'zh-TW'
        ? '探索房地產投資機會和市場趨勢。'
        : 'Exploring real estate investment opportunities and market trends.',
      category: language === 'zh-TW' ? '論壇' : 'Forum',
      attendees: '85',
      rating: 4.6
    },
    {
      id: 6,
      title: language === 'zh-TW' ? '保險規劃研討會' : 'Insurance Planning Seminar',
      date: 'February 10, 2024',
      time: '10:00 AM - 12:00 PM',
      location: language === 'zh-TW' ? '線上活動' : 'Virtual Event',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: language === 'zh-TW'
        ? '了解不同類型的保險以及如何選擇合適的保障。'
        : 'Understanding different types of insurance and how to choose the right coverage.',
      category: language === 'zh-TW' ? '研討會' : 'Seminar',
      attendees: '95',
      rating: 4.7
    }
  ];

  const categories = language === 'zh-TW' 
    ? ['全部', '工作坊', '研討會', '大師班', '論壇', '網路研討會']
    : ['All', 'Workshop', 'Seminar', 'Masterclass', 'Forum', 'Webinar'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('nav.events')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {language === 'zh-TW'
              ? '參加我們專家主導的活動，提升您的財務知識並與行業專業人士建立聯繫。'
              : 'Join our expert-led events to enhance your financial knowledge and connect with industry professionals.'
            }
          </p>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event Tabs */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('events.upcoming')}
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('events.past')}
              </button>
            </div>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-600">{event.category}</span>
                    {activeTab === 'upcoming' ? (
                      <span className="text-sm text-gray-500">{event.price}</span>
                    ) : (
                      <div className="flex items-center">
                        <i className="fas fa-star text-yellow-400 text-sm mr-1"></i>
                        <span className="text-sm text-gray-600">{event.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar mr-2"></i>
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-clock mr-2"></i>
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      {event.location}
                    </div>
                  </div>

                  {activeTab === 'upcoming' ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'zh-TW' ? '已註冊：' : 'Registered:'}
                        </span>
                        <span className="font-semibold">{event.registered}/{event.spots}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(event.registered / event.spots) * 100}%` }}
                        ></div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                        {t('events.registerNow')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'zh-TW' ? '參與者：' : 'Attendees:'}
                        </span>
                        <span className="font-semibold">{event.attendees}</span>
                      </div>
                      <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200">
                        {t('events.revisit')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              {language === 'zh-TW' ? '載入更多活動' : 'Load More Events'}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'zh-TW' ? '保持更新' : 'Stay Updated'}
          </h2>
          <p className="text-xl mb-8">
            {language === 'zh-TW'
              ? '獲取即將舉行的活動和獨家內容的通知'
              : 'Get notified about upcoming events and exclusive content'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={language === 'zh-TW' ? '輸入您的電子郵件' : 'Enter your email'}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              {language === 'zh-TW' ? '訂閱' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage; 