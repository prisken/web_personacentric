import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';
import { Helmet } from 'react-helmet';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      // Update document title
      document.title = blog.meta_title || blog.title;
      
      // Add schema markup
      addSchemaMarkup();
      
      // Setup table of contents scrolling
      setupTableOfContents();
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/blogs/${slug}`);
      
      if (response.success) {
        setBlog(response.data);
        // Increment view count
        await apiService.post(`/blogs/${response.data.id}/view`);
        
        // Fetch related blogs
        if (response.data.categories && response.data.categories.length > 0) {
          await fetchRelatedBlogs(response.data.categories);
        }
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
      const categoryIds = categories.map(cat => cat.id);
      const response = await apiService.get(`/blogs?category_ids=${categoryIds.join(',')}&limit=3&exclude=${blog?.id}`);
      if (response.success) {
        setRelatedBlogs(response.data);
      }
    } catch (error) {
      console.error('Fetch related blogs error:', error);
    }
  };

  const addSchemaMarkup = () => {
    if (!blog) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.meta_description || blog.excerpt,
      "image": blog.featured_image_url,
      "author": {
        "@type": "Person",
        "name": blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : "Financial Advisor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "PersonaCentric Financial",
        "logo": {
          "@type": "ImageObject",
          "url": "https://your-domain.com/logo.png"
        }
      },
      "datePublished": blog.published_at,
      "dateModified": blog.updated_at || blog.published_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://your-domain.com/blogs/${blog.slug}`
      },
      "articleSection": blog.categories?.map(cat => cat.name).join(', '),
      "keywords": blog.meta_keywords,
      "wordCount": blog.content.split(' ').length,
      "timeRequired": `PT${blog.reading_time}M`
    };

    // Remove existing schema
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  };

  const setupTableOfContents = () => {
    const headings = document.querySelectorAll('h2, h3');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    headings.forEach(heading => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => observer.disconnect();
  };

  const generateTableOfContents = () => {
    if (!blog?.content) return [];

    const headings = blog.content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g);
    if (!headings) return [];

    return headings.map((heading, index) => {
      const level = heading.match(/<h([23])/)[1];
      const text = heading.replace(/<[^>]*>/g, '');
      const id = `heading-${index}`;
      
      return { level: parseInt(level), text, id };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (minutes) => {
    return language === 'zh-TW' ? `${minutes} 分鐘閱讀` : `${minutes} min read`;
  };

  const shareBlog = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    const text = blog.excerpt;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'zh-TW' ? '找不到文章' : 'Article Not Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {language === 'zh-TW' ? '抱歉，您要找的文章不存在。' : 'Sorry, the article you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/blogs')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'zh-TW' ? '返回部落格' : 'Back to Blog'}
          </button>
        </div>
      </div>
    );
  }

  const tableOfContents = generateTableOfContents();

  return (
    <>
      <Helmet>
        <title>{blog.meta_title || blog.title}</title>
        <meta name="description" content={blog.meta_description || blog.excerpt} />
        <meta name="keywords" content={blog.meta_keywords} />
        <meta property="og:title" content={blog.meta_title || blog.title} />
        <meta property="og:description" content={blog.meta_description || blog.excerpt} />
        <meta property="og:image" content={blog.featured_image_url} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.meta_title || blog.title} />
        <meta name="twitter:description" content={blog.meta_description || blog.excerpt} />
        <meta name="twitter:image" content={blog.featured_image_url} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="pt-16 bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center space-x-2">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-blue-600">
                  {language === 'zh-TW' ? '首頁' : 'Home'}
                </button>
              </li>
              <li>/</li>
              <li>
                <button onClick={() => navigate('/blogs')} className="hover:text-blue-600">
                  {language === 'zh-TW' ? '部落格' : 'Blog'}
                </button>
              </li>
              <li>/</li>
              <li className="text-gray-900">{blog.title}</li>
            </ol>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              {blog.categories && blog.categories.map((category, index) => (
                <span key={category.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {category.name}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img 
                    src={blog.author?.profile_image_url || '/default-avatar.png'} 
                    alt={blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : 'Author'}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : 'Financial Advisor'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(blog.published_at)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatReadingTime(blog.reading_time || 5)}</span>
                <span>•</span>
                <span>{blog.view_count || 0} {language === 'zh-TW' ? '次瀏覽' : 'views'}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {blog.featured_image_url && (
            <div className="mb-8">
              <img 
                src={blog.featured_image_url} 
                alt={blog.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="flex gap-8">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {language === 'zh-TW' ? '目錄' : 'Table of Contents'}
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <a
                        key={index}
                        href={`#${item.id}`}
                        className={`block text-sm py-1 px-2 rounded transition-colors ${
                          activeHeading === item.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        style={{ paddingLeft: `${(item.level - 2) * 12 + 8}px` }}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Article Content */}
            <article className="flex-1">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {language === 'zh-TW' ? '分享這篇文章：' : 'Share this article:'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => shareBlog('facebook')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => shareBlog('twitter')}
                        className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="Share on Twitter"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => shareBlog('linkedin')}
                        className="p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {language === 'zh-TW' ? '最後更新：' : 'Last updated: '}
                    {formatDate(blog.updated_at || blog.published_at)}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {language === 'zh-TW' ? '相關文章' : 'Related Articles'}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <article key={relatedBlog.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                    {relatedBlog.featured_image_url && (
                      <img 
                        src={relatedBlog.featured_image_url} 
                        alt={relatedBlog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {relatedBlog.categories && relatedBlog.categories.map((category) => (
                          <span key={category.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.name}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedBlog.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatDate(relatedBlog.published_at)}
                        </span>
                        <button
                          onClick={() => navigate(`/blogs/${relatedBlog.slug}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {language === 'zh-TW' ? '閱讀更多' : 'Read More'} →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter Signup */}
          <section className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'zh-TW' ? '訂閱我們的財務專欄' : 'Subscribe to Our Financial Newsletter'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {language === 'zh-TW' 
                ? '獲取最新的投資策略、退休規劃建議和財務管理技巧，直接發送到您的收件箱。'
                : 'Get the latest investment strategies, retirement planning tips, and financial management advice delivered to your inbox.'
              }
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder={language === 'zh-TW' ? '輸入您的電子郵件' : 'Enter your email'}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
                {language === 'zh-TW' ? '訂閱' : 'Subscribe'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage; 