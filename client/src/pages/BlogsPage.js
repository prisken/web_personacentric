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
      readTime: language === 'zh-TW' ? '11 分鐘閱讀' : '11 min read',
      category: language === 'zh-TW' ? '房地產' : 'Real Estate',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
      featured: false
    },
    {
      id: 6,
      title: language === 'zh-TW'
        ? '建立綜合財務計劃'
        : 'Building a Comprehensive Financial Plan',
      excerpt: language === 'zh-TW'
        ? '學習如何創建涵蓋您財務生活各個方面的綜合財務計劃。'
        : 'Learn how to create a comprehensive financial plan that covers all aspects of your financial life.',
      content: language === 'zh-TW'
        ? '綜合財務計劃是財務成功的基礎。它應該涵蓋您財務生活的各個方面，從預算到遺產規劃...'
        : 'A comprehensive financial plan is the foundation of financial success. It should cover all aspects of your financial life, from budgeting to estate planning...',
      author: 'Robert Thompson',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      date: 'March 3, 2024',
      readTime: language === 'zh-TW' ? '14 分鐘閱讀' : '14 min read',
      category: language === 'zh-TW' ? '財務規劃' : 'Financial Planning',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === (language === 'zh-TW' ? '全部' : 'All')
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('nav.blogs')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {language === 'zh-TW'
              ? '通過我們專業團隊的最新財務見解、專家建議和市場分析保持信息靈通。'
              : 'Stay informed with the latest financial insights, expert advice, and market analysis from our team of professionals.'
            }
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('blogs.featured')}
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-full overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="ml-4 text-sm text-gray-500">{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center mb-6">
                    <img 
                      src={featuredPost.authorImage} 
                      alt={featuredPost.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{featuredPost.author}</p>
                      <p className="text-sm text-gray-500">{featuredPost.date}</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                    {t('blogs.readMore')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={post.authorImage} 
                        alt={post.author}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      {t('blogs.readMore')} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              {language === 'zh-TW' ? '載入更多文章' : 'Load More Articles'}
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
              ? '獲取最新的財務見解和專家建議，直接發送到您的收件箱'
              : 'Get the latest financial insights and expert advice delivered to your inbox'
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

export default BlogsPage; 