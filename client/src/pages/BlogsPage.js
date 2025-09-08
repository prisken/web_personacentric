import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';
import { Helmet } from 'react-helmet';

const BlogsPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  const fetchBlogs = useCallback(async (page = 1, category = null) => {
    try {
      setLoading(true);
      let url = `/blogs?page=${page}&limit=12&status=published`;
      
      const response = await apiService.get(url);
      if (response.success && response.data) {
        // Ensure all blog posts have required fields
        const processedBlogs = response.data.map(blog => ({
          id: blog.id || '1',
          title: blog.title || 'Untitled',
          slug: blog.slug || 'untitled',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          author_id: blog.author_id || 'admin-user',
          status: blog.status || 'published',
          featured_image_url: blog.featured_image_url || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
          meta_title: blog.meta_title || blog.title || 'Untitled',
          meta_description: blog.meta_description || blog.excerpt || '',
          reading_time: blog.reading_time || 5,
          view_count: blog.view_count || 0,
          like_count: blog.like_count || 0,
          share_count: blog.share_count || 0,
          published_at: blog.published_at || new Date().toISOString(),
          created_at: blog.created_at || new Date().toISOString(),
          updated_at: blog.updated_at || new Date().toISOString()
        }));
        
        setBlogPosts(processedBlogs);
        setPagination(response.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: processedBlogs.length,
          items_per_page: 12
        });
      } else {
        console.error('Invalid response format:', response);
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiService.get('/blogs/categories/all');
      if (response.success && response.data) {
        // Ensure categories are in the right format
        const processedCategories = response.data.map(cat => ({
          id: cat.id || 1,
          name: cat.name || 'Category',
          slug: cat.slug || 'category'
        }));
        setCategories(processedCategories);
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
  }, [language]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [fetchBlogs, fetchCategories]);

  const filteredPosts = selectedCategory === 'All' || selectedCategory === '全部'
    ? blogPosts
    : blogPosts.filter(post => {
        // For now, show all posts since we don't have category filtering in the API yet
        return true;
      });

  const featuredPost = filteredPosts[0]; // Use first post as featured
  const regularPosts = filteredPosts.slice(1); // Rest are regular posts

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        {/* Hero Section - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
                {language === 'zh-TW' ? '市場追擊' : 'Financial Knowledge Hub'}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-90">
                {language === 'zh-TW' 
                  ? '由財務顧問撰寫的市場分析，掌握投資理財要訣'
                  : 'In-depth articles written by professional financial advisors to help you master investment and financial planning'
                }
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3">
                  <span className="text-sm sm:text-lg">
                    {language === 'zh-TW' ? `${blogPosts.length} 篇專業文章` : `${blogPosts.length} Professional Articles`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter - Mobile Optimized */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => {
                // Handle both string categories and object categories
                const categoryName = typeof category === 'string' ? category : category.name;
                const categoryKey = typeof category === 'string' ? category : category.id;
                
                return (
                  <button
                    key={categoryKey}
                    onClick={() => setSelectedCategory(categoryName)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === categoryName
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Featured Post - Mobile Optimized */}
          {featuredPost && selectedCategory === 'All' && (
            <section className="mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                {language === 'zh-TW' ? '精選文章' : 'Featured Article'}
              </h2>
              <article className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <img 
                      src={featuredPost.featured_image_url} 
                      alt={featuredPost.title}
                      className="w-full h-48 sm:h-56 lg:h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800';
                      }}
                    />
                  </div>
                  <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800">
                        投資理財
                      </span>
                      <span className="ml-3 sm:ml-4 text-xs sm:text-sm lg:text-base text-gray-500">
                        {featuredPost.reading_time ? `${featuredPost.reading_time} 分鐘閱讀` : '5 分鐘閱讀'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center mb-6 sm:mb-8">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full mr-2 sm:mr-3 lg:mr-4 bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs sm:text-sm lg:text-base">
                          {featuredPost.author_id ? featuredPost.author_id.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-900">
                          {featuredPost.author_id || 'Admin User'}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-500">
                          {featuredPost.published_at ? formatDate(featuredPost.published_at) : '2024-01-15'}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/blogs/${featuredPost.slug}`)}
                      className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {language === 'zh-TW' ? '閱讀全文' : 'Read More'}
                    </button>
                  </div>
                </div>
              </article>
            </section>
          )}

          {/* Regular Posts Grid - Mobile Optimized */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              {language === 'zh-TW' ? '最新文章' : 'Latest Articles'}
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-32 sm:h-40 lg:h-48 bg-gray-200"></div>
                    <div className="p-4 sm:p-6">
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2 sm:mb-3"></div>
                      <div className="h-4 sm:h-6 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6 mb-3 sm:mb-4"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {regularPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800';
                        }}
                      />
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                        <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          投資理財
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {post.reading_time ? `${post.reading_time} 分鐘閱讀` : post.readTime || '5 分鐘閱讀'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {post.view_count || 0} {language === 'zh-TW' ? '次瀏覽' : 'views'}
                        </span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {post.author_id ? post.author_id.charAt(0).toUpperCase() : 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {post.author_id || 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.published_at ? formatDate(post.published_at) : '2024-01-15'}
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/blogs/${post.slug}`)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm lg:text-base transition-all duration-200 hover:translate-x-1"
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

          {/* Newsletter Signup - Mobile Optimized */}
          <section className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-12 text-white text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4">
              {language === 'zh-TW' ? '訂閱財務專欄' : 'Subscribe to Financial Insights'}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
              {language === 'zh-TW' 
                ? '獲取最新的投資策略、退休規劃建議和財務管理技巧，直接發送到您的收件箱。'
                : 'Get the latest investment strategies, retirement planning tips, and financial management advice delivered to your inbox.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={language === 'zh-TW' ? '輸入您的電子郵件' : 'Enter your email'}
                className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl text-gray-900 focus:ring-4 focus:ring-white focus:outline-none text-sm sm:text-base"
              />
              <button className="bg-white text-blue-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
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