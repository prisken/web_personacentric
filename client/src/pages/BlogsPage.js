import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';
import { Helmet } from 'react-helmet';

const BlogsPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async (page = 1, category = null) => {
    try {
      setLoading(true);
      let url = `/blogs?page=${page}&limit=12&status=published`;
      if (category && category !== 'All' && category !== '全部') {
        // For now, we'll filter client-side since the API doesn't support category filtering yet
      }
      
      const response = await apiService.get(url);
      if (response.success) {
        setBlogPosts(response.data);
        setPagination(response.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: response.data.length,
          items_per_page: 12
        });
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
      // Fallback to dummy data if API fails
      setBlogPosts(getDummyBlogPosts());
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/blogs/categories/all');
      if (response.success) {
        setCategories(response.data);
      } else {
        // Fallback to default categories
        setCategories(language === 'zh-TW' 
          ? ['全部', '投資', '退休', '稅務規劃', '保險', '房地產', '財務規劃', '市場分析']
          : ['All', 'Investment', 'Retirement', 'Tax Planning', 'Insurance', 'Real Estate', 'Financial Planning', 'Market Analysis']
        );
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
      // Fallback to default categories
      setCategories(language === 'zh-TW' 
        ? ['全部', '投資', '退休', '稅務規劃', '保險', '房地產', '財務規劃', '市場分析']
        : ['All', 'Investment', 'Retirement', 'Tax Planning', 'Insurance', 'Real Estate', 'Financial Planning', 'Market Analysis']
      );
    }
  };

  const getDummyBlogPosts = () => [
    {
      id: 1,
      title: '2024年投資策略：您需要知道的',
      excerpt: '探索2024年最有效的投資策略，包括股票、債券、房地產和另類投資的完整指南。',
      content: '詳細的投資策略內容...',
      author: { first_name: '張', last_name: '理財師' },
      published_at: '2024-01-15',
      reading_time: 8,
      featured_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: '投資',
      slug: '2024-investment-strategies',
      featured: true,
      view_count: 1250
    },
    {
      id: 2,
      title: '了解保險政策：完整指南',
      excerpt: '深入了解各種保險類型，幫助您做出明智的保險決策。',
      content: '保險政策詳細內容...',
      author: { first_name: '李', last_name: '保險顧問' },
      published_at: '2024-01-10',
      reading_time: 6,
      featured_image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: '保險',
      slug: 'insurance-policy-guide',
      featured: false,
      view_count: 890
    },
    {
      id: 3,
      title: '退休規劃要點：早開始，好退休',
      excerpt: '制定有效的退休計劃，確保您的黃金歲月財務安全。',
      content: '退休規劃詳細內容...',
      author: { first_name: '王', last_name: '退休專家' },
      published_at: '2024-01-05',
      reading_time: 10,
      featured_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: '退休',
      slug: 'retirement-planning-essentials',
      featured: false,
      view_count: 1100
    },
    {
      id: 4,
      title: '小企業主的稅務規劃策略',
      excerpt: '為小企業主提供實用的稅務規劃建議，最大化稅收優惠。',
      content: '稅務規劃詳細內容...',
      author: { first_name: '陳', last_name: '稅務顧問' },
      published_at: '2024-01-01',
      reading_time: 7,
      featured_image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: '稅務規劃',
      slug: 'small-business-tax-strategies',
      featured: false,
      view_count: 750
    },
    {
      id: 5,
      title: '房地產投資：2024年的機遇',
      excerpt: '分析2024年房地產市場趨勢，識別最佳投資機會。',
      content: '房地產投資詳細內容...',
      author: { first_name: '林', last_name: '房地產專家' },
      published_at: '2023-12-28',
      reading_time: 9,
      featured_image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
      category: '房地產',
      slug: 'real-estate-investment-2024',
      featured: false,
      view_count: 980
    },
    {
      id: 6,
      title: '市場分析：2024年第一季度回顧',
      excerpt: '深入分析2024年第一季度的市場表現和未來趨勢預測。',
      content: '市場分析詳細內容...',
      author: { first_name: '黃', last_name: '市場分析師' },
      published_at: '2023-12-25',
      reading_time: 5,
      featured_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: '市場分析',
      slug: 'market-analysis-q1-2024',
      featured: false,
      view_count: 650
    }
  ];

  const filteredPosts = selectedCategory === 'All' || selectedCategory === '全部'
    ? blogPosts
    : blogPosts.filter(post => {
        // Check if post has categories array and if any category name matches
        if (post.categories && post.categories.length > 0) {
          return post.categories.some(cat => cat.name === selectedCategory);
        }
        // Fallback to old category field
        return post.category === selectedCategory;
      });

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(post => !post.featured || post.id === featuredPost?.id);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatReadingTime = (minutes) => {
    return language === 'zh-TW' ? `${minutes} 分鐘閱讀` : `${minutes} min read`;
  };

  return (
    <>
      <Helmet>
        <title>{language === 'zh-TW' ? '財務部落格 - 投資理財專業文章' : 'Financial Blog - Investment & Financial Planning Articles'}</title>
        <meta name="description" content={language === 'zh-TW' 
          ? '探索專業的財務規劃、投資策略、退休規劃和稅務建議文章。由資深財務顧問撰寫，助您做出明智的財務決策。'
          : 'Discover professional financial planning, investment strategies, retirement planning, and tax advice articles. Written by experienced financial advisors to help you make informed financial decisions.'
        } />
        <meta name="keywords" content={language === 'zh-TW' 
          ? '財務規劃,投資策略,退休規劃,稅務建議,保險,房地產投資,理財顧問'
          : 'financial planning,investment strategies,retirement planning,tax advice,insurance,real estate investment,financial advisor'
        } />
        <meta property="og:title" content={language === 'zh-TW' ? '財務部落格 - 投資理財專業文章' : 'Financial Blog - Investment & Financial Planning Articles'} />
        <meta property="og:description" content={language === 'zh-TW' 
          ? '探索專業的財務規劃、投資策略、退休規劃和稅務建議文章。'
          : 'Discover professional financial planning, investment strategies, retirement planning, and tax advice articles.'
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="pt-16 bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {language === 'zh-TW' ? '財務知識專欄' : 'Financial Knowledge Hub'}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                {language === 'zh-TW' 
                  ? '由專業財務顧問撰寫的深度文章，助您掌握投資理財要訣'
                  : 'In-depth articles written by professional financial advisors to help you master investment and financial planning'
                }
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-lg">
                    {language === 'zh-TW' ? `${blogPosts.length} 篇專業文章` : `${blogPosts.length} Professional Articles`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Post */}
          {featuredPost && selectedCategory === 'All' && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {language === 'zh-TW' ? '精選文章' : 'Featured Article'}
              </h2>
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <img 
                      src={featuredPost.featured_image_url} 
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 lg:p-12">
                    <div className="flex items-center mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800">
                        {featuredPost.categories && featuredPost.categories.length > 0 
                          ? featuredPost.categories[0].name 
                          : featuredPost.category || '未分類'}
                      </span>
                      <span className="ml-4 text-sm lg:text-base text-gray-500">
                        {featuredPost.reading_time ? `${featuredPost.reading_time} 分鐘閱讀` : featuredPost.readTime || '5 分鐘閱讀'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center mb-8">
                      <img 
                        src={featuredPost.author?.profile_image_url || featuredPost.authorImage} 
                        alt={featuredPost.author?.first_name || featuredPost.author}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full mr-3 lg:mr-4"
                      />
                      <div>
                        <p className="text-sm lg:text-base font-medium text-gray-900">
                          {featuredPost.author ? `${featuredPost.author.first_name} ${featuredPost.author.last_name}` : featuredPost.author}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-500">
                          {featuredPost.published_at ? formatDate(featuredPost.published_at) : featuredPost.date}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/blogs/${featuredPost.slug}`)}
                      className="bg-blue-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl text-sm lg:text-base font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {language === 'zh-TW' ? '閱讀全文' : 'Read More'}
                    </button>
                  </div>
                </div>
              </article>
            </section>
          )}

          {/* Regular Posts Grid */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {language === 'zh-TW' ? '最新文章' : 'Latest Articles'}
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.categories && post.categories.length > 0 
                            ? post.categories[0].name 
                            : post.category || '未分類'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">
                          {post.reading_time ? `${post.reading_time} 分鐘閱讀` : post.readTime || '5 分鐘閱讀'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {post.view_count || 0} {language === 'zh-TW' ? '次瀏覽' : 'views'}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={post.author?.profile_image_url || post.authorImage} 
                            alt={post.author?.first_name || post.author}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {post.author ? `${post.author.first_name} ${post.author.last_name}` : post.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.published_at ? formatDate(post.published_at) : post.date}
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/blogs/${post.slug}`)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm lg:text-base transition-all duration-200 hover:translate-x-1"
                        >
                          {language === 'zh-TW' ? '閱讀更多' : 'Read More'} →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Newsletter Signup */}
          <section className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {language === 'zh-TW' ? '訂閱財務專欄' : 'Subscribe to Financial Insights'}
            </h2>
            <p className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {language === 'zh-TW' 
                ? '獲取最新的投資策略、退休規劃建議和財務管理技巧，直接發送到您的收件箱。'
                : 'Get the latest investment strategies, retirement planning tips, and financial management advice delivered to your inbox.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={language === 'zh-TW' ? '輸入您的電子郵件' : 'Enter your email'}
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:ring-4 focus:ring-white focus:outline-none text-base"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-base">
                {language === 'zh-TW' ? '訂閱' : 'Subscribe'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BlogsPage; 