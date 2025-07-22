import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const BlogsPage = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = language === 'zh-TW' 
    ? ['全部', '投資', '退休', '稅務規劃', '保險', '房地產', '財務規劃', '市場分析']
    : ['All', 'Investment', 'Retirement', 'Tax Planning', 'Insurance', 'Real Estate', 'Financial Planning', 'Market Analysis'];

  const blogPosts = [
    {
      id: 1,
      title: language === 'zh-TW' 
        ? '2024年投資策略：您需要知道的'
        : 'Investment Strategies for 2024: What You Need to Know',
      excerpt: language === 'zh-TW'
        ? '發現今年將主導金融格局的頂級投資策略，包括新興趨勢和專家見解。'
        : 'Discover the top investment strategies that will dominate the financial landscape this year, including emerging trends and expert insights.',
      content: language === 'zh-TW'
        ? '金融格局不斷演變，2024年為投資者帶來新的機遇和挑戰。在這份綜合指南中，我們探討最有效的投資策略，幫助您實現財務目標...'
        : 'The financial landscape is constantly evolving, and 2024 brings new opportunities and challenges for investors. In this comprehensive guide, we explore the most effective investment strategies that can help you achieve your financial goals...',
      author: 'Sarah Johnson',
      authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      date: 'March 15, 2024',
      readTime: language === 'zh-TW' ? '8 分鐘閱讀' : '8 min read',
      category: language === 'zh-TW' ? '投資' : 'Investment',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      featured: true
    },
    {
      id: 2,
      title: language === 'zh-TW'
        ? '了解保險政策：完整指南'
        : 'Understanding Insurance Policies: A Complete Guide',
      excerpt: language === 'zh-TW'
        ? '為您的需求選擇合適保險保障的綜合指南，從人壽保險到財產保障。'
        : 'A comprehensive guide to choosing the right insurance coverage for your needs, from life insurance to property coverage.',
      content: language === 'zh-TW'
        ? '保險是任何綜合財務計劃的重要組成部分。了解不同類型的保險以及如何選擇合適的保障，可以保護您和您的家人免受財務困難...'
        : 'Insurance is a crucial component of any comprehensive financial plan. Understanding the different types of insurance and how to choose the right coverage can protect you and your family from financial hardship...',
      author: 'Michael Chen',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      date: 'March 12, 2024',
      readTime: language === 'zh-TW' ? '12 分鐘閱讀' : '12 min read',
      category: language === 'zh-TW' ? '保險' : 'Insurance',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      featured: false
    },
    {
      id: 3,
      title: language === 'zh-TW'
        ? '退休規劃要點：早開始，好退休'
        : 'Retirement Planning Essentials: Start Early, Retire Well',
      excerpt: language === 'zh-TW'
        ? '從今天開始規劃您的退休，使用這些基本策略和技巧建立安全的財務未來。'
        : 'Start planning your retirement today with these essential strategies and tips for building a secure financial future.',
      content: language === 'zh-TW'
        ? '退休規劃是您將做出的最重要的財務決策之一。您越早開始，您的錢就有更多時間通過複利增長...'
        : 'Retirement planning is one of the most important financial decisions you\'ll make. The earlier you start, the more time your money has to grow through compound interest...',
      author: 'Emily Rodriguez',
      authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      date: 'March 10, 2024',
      readTime: language === 'zh-TW' ? '10 分鐘閱讀' : '10 min read',
      category: language === 'zh-TW' ? '退休' : 'Retirement',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      featured: false
    },
    {
      id: 4,
      title: language === 'zh-TW'
        ? '小企業主的稅務規劃策略'
        : 'Tax Planning Strategies for Small Business Owners',
      excerpt: language === 'zh-TW'
        ? '使用專為小企業主和企業家設計的專家策略最大化您的稅務效率。'
        : 'Maximize your tax efficiency with expert strategies designed specifically for small business owners and entrepreneurs.',
      content: language === 'zh-TW'
        ? '稅務規劃對於希望最小化稅負同時保持合規的小企業主來說至關重要。本指南涵蓋基本策略...'
        : 'Tax planning is crucial for small business owners who want to minimize their tax burden while staying compliant with regulations. This guide covers essential strategies...',
      author: 'David Kim',
      authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      date: 'March 8, 2024',
      readTime: language === 'zh-TW' ? '15 分鐘閱讀' : '15 min read',
      category: language === 'zh-TW' ? '稅務規劃' : 'Tax Planning',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      featured: false
    },
    {
      id: 5,
      title: language === 'zh-TW'
        ? '房地產投資：2024年的機遇'
        : 'Real Estate Investment: Opportunities in 2024',
      excerpt: language === 'zh-TW'
        ? '探索房地產投資的最新趨勢和機遇，從住宅物業到商業投資。'
        : 'Explore the latest trends and opportunities in real estate investment, from residential properties to commercial ventures.',
      content: language === 'zh-TW'
        ? '房地產繼續成為許多投資者的熱門投資選擇。在2024年，我們看到各個市場領域出現新的機遇...'
        : 'Real estate continues to be a popular investment choice for many investors. In 2024, we\'re seeing new opportunities emerge in various market segments...',
      author: 'Lisa Wang',
      authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      date: 'March 5, 2024',
      readTime: language === 'zh-TW' ? '14 分鐘閱讀' : '14 min read',
      category: language === 'zh-TW' ? '房地產' : 'Real Estate',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
      featured: false
    },
    {
      id: 6,
      title: language === 'zh-TW'
        ? '市場分析：2024年第一季度回顧'
        : 'Market Analysis: Q1 2024 Review',
      excerpt: language === 'zh-TW'
        ? '深入分析2024年第一季度的市場表現和對未來趨勢的預測。'
        : 'Deep dive into Q1 2024 market performance and predictions for future trends.',
      content: language === 'zh-TW'
        ? '2024年第一季度為投資者帶來了混合的結果。讓我們分析關鍵市場指標和對未來幾個月的預期...'
        : 'Q1 2024 brought mixed results for investors. Let\'s analyze key market indicators and expectations for the coming months...',
      author: 'Robert Zhang',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      date: 'March 1, 2024',
      readTime: language === 'zh-TW' ? '11 分鐘閱讀' : '11 min read',
      category: language === 'zh-TW' ? '市場分析' : 'Market Analysis',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'All' || selectedCategory === '全部'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 lg:py-12">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
              📝 {t('blogs.title')}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl">
              {t('blogs.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 lg:py-8">
            <div className="flex flex-wrap gap-3 lg:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">
              ⭐ {language === 'zh-TW' ? '精選文章' : 'Featured Article'}
            </h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-full overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center mb-4 lg:mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800">
                      {featuredPost.category}
                    </span>
                    <span className="ml-4 text-sm lg:text-base text-gray-500">
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={featuredPost.authorImage} 
                        alt={featuredPost.author}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full mr-3 lg:mr-4"
                      />
                      <div>
                        <p className="text-sm lg:text-base font-medium text-gray-900">{featuredPost.author}</p>
                        <p className="text-xs lg:text-sm text-gray-500">{featuredPost.date}</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl text-sm lg:text-base font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                      {language === 'zh-TW' ? '閱讀全文' : 'Read More'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {regularPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105">
              {/* Post Image */}
              <div className="h-48 lg:h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Post Content */}
              <div className="p-6 lg:p-8">
                {/* Category and Read Time */}
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800">
                    {post.category}
                  </span>
                  <span className="text-xs lg:text-sm text-gray-500">
                    {post.readTime}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 line-clamp-2 leading-tight">
                  {post.title}
                </h3>

                {/* Post Excerpt */}
                <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Author and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={post.authorImage} 
                      alt={post.author}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">{post.author}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm lg:text-base transition-all duration-200 hover:translate-x-1">
                    {language === 'zh-TW' ? '閱讀更多' : 'Read More'} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 lg:p-12 text-white">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 lg:mb-6">
                {language === 'zh-TW' ? '保持更新' : 'Stay Updated'}
              </h3>
              <p className="text-lg lg:text-xl mb-8 lg:mb-10 opacity-90">
                {language === 'zh-TW'
                  ? '獲取最新的財務見解和獨家內容'
                  : 'Get the latest financial insights and exclusive content'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={language === 'zh-TW' ? '輸入您的電子郵件' : 'Enter your email'}
                  className="flex-1 px-6 py-4 lg:px-8 lg:py-5 rounded-xl text-gray-900 focus:ring-4 focus:ring-white focus:outline-none text-base lg:text-lg"
                />
                <button className="bg-white text-blue-600 px-8 py-4 lg:px-10 lg:py-5 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-base lg:text-lg">
                  {language === 'zh-TW' ? '訂閱' : 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage; 