import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/blogs/${slug}`);
      if (response.success) {
        setBlog(response.data);
        fetchRelatedBlogs(response.data.categories);
      } else {
        setError('Blog not found');
      }
    } catch (error) {
      console.error('Fetch blog error:', error);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (categories) => {
    try {
      if (categories && categories.length > 0) {
        const categoryId = categories[0].id;
        const response = await apiService.get(`/blogs?category=${categoryId}&limit=3&exclude=${blog?.id}`);
        if (response.success) {
          setRelatedBlogs(response.data.filter(b => b.id !== blog?.id));
        }
      }
    } catch (error) {
      console.error('Fetch related blogs error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (minutes) => {
    return language === 'zh-TW' ? `${minutes} 分鐘閱讀` : `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'zh-TW' ? '文章未找到' : 'Article Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'zh-TW' ? '抱歉，您要查找的文章不存在。' : 'Sorry, the article you are looking for does not exist.'}
            </p>
            <button
              onClick={() => navigate('/blogs')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300"
            >
              {language === 'zh-TW' ? '返回部落格' : 'Back to Blog'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button
                  onClick={() => navigate('/blogs')}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  {language === 'zh-TW' ? '部落格' : 'Blog'}
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {blog.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <div className="mb-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.categories?.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img
                    src={blog.author?.profile_image_url || 'https://via.placeholder.com/40'}
                    alt={blog.author?.first_name || 'Author'}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : 'Unknown Author'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {blog.published_at ? formatDate(blog.published_at) : 'Unknown Date'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatReadingTime(blog.reading_time || 5)}</span>
                <span>{blog.view_count || 0} {language === 'zh-TW' ? '次瀏覽' : 'views'}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featured_image_url && (
            <div className="mb-8">
              <img
                src={blog.featured_image_url}
                alt={blog.title}
                className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          {/* Excerpt */}
          {blog.excerpt && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <p className="text-lg text-gray-700 italic">
                {blog.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {blog.content}
            </div>
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{language === 'zh-TW' ? '喜歡' : 'Like'}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>{language === 'zh-TW' ? '分享' : 'Share'}</span>
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {language === 'zh-TW' ? '最後更新' : 'Last updated'}: {formatDate(blog.updated_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'zh-TW' ? '相關文章' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/blogs/${relatedBlog.slug}`)}
                >
                  {relatedBlog.featured_image_url && (
                    <img
                      src={relatedBlog.featured_image_url}
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {relatedBlog.categories?.[0]?.name || '未分類'}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {formatReadingTime(relatedBlog.reading_time || 5)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {relatedBlog.excerpt}
                    </p>
                    <div className="flex items-center mt-4">
                      <img
                        src={relatedBlog.author?.profile_image_url || 'https://via.placeholder.com/32'}
                        alt={relatedBlog.author?.first_name || 'Author'}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {relatedBlog.author ? `${relatedBlog.author.first_name} ${relatedBlog.author.last_name}` : 'Unknown Author'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {relatedBlog.published_at ? formatDate(relatedBlog.published_at) : 'Unknown Date'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
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

export default BlogDetailPage; 