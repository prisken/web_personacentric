import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import apiService from '../../services/api';

const BlogManagement = () => {
  const { t, language } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_ids: [],
    featured_image_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    status: 'draft',
    featured: false
  });
  const [seoPreview, setSeoPreview] = useState({
    title: '',
    description: '',
    url: ''
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-generate SEO preview when title or meta fields change
    const title = formData.meta_title || formData.title;
    const description = formData.meta_description || formData.excerpt;
    const slug = generateSlug(formData.title);
    
    setSeoPreview({
      title: title || 'Blog Title',
      description: description || 'Blog description will appear here...',
      url: `https://your-domain.com/blogs/${slug}`
    });
  }, [formData.title, formData.meta_title, formData.meta_description, formData.excerpt]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/blogs?limit=100&status=all');
      if (response.success) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/blogs/categories/all');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const generateSlug = (title) => {
    if (!title) return '';
    return title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const blogData = {
        ...formData,
        slug: generateSlug(formData.title)
      };

      if (editingBlog) {
        await apiService.put(`/blogs/${editingBlog.id}`, blogData);
      } else {
        await apiService.post('/blogs', blogData);
      }

      setShowModal(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Save blog error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category_ids: blog.categories?.map(cat => cat.id) || [],
      featured_image_url: blog.featured_image_url || '',
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || '',
      status: blog.status || 'draft',
      featured: blog.featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm(language === 'zh-TW' ? '確定要刪除這篇文章嗎？' : 'Are you sure you want to delete this blog post?')) {
      try {
        await apiService.delete(`/blogs/${blogId}`);
        fetchBlogs();
      } catch (error) {
        console.error('Delete blog error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category_ids: [],
      featured_image_url: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      status: 'draft',
      featured: false
    });
    setEditingBlog(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: language === 'zh-TW' ? '草稿' : 'Draft' },
      published: { color: 'bg-green-100 text-green-800', text: language === 'zh-TW' ? '已發布' : 'Published' },
      archived: { color: 'bg-yellow-100 text-yellow-800', text: language === 'zh-TW' ? '已封存' : 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getSeoScore = () => {
    let score = 0;
    if (formData.title) score += 20;
    if (formData.excerpt) score += 15;
    if (formData.meta_title) score += 15;
    if (formData.meta_description) score += 15;
    if (formData.meta_keywords) score += 10;
    if (formData.featured_image_url) score += 10;
    if (formData.category_ids.length > 0) score += 10;
    if (formData.content && formData.content.length > 500) score += 5;
    
    return Math.min(score, 100);
  };

  const seoScore = getSeoScore();
  const seoScoreColor = seoScore >= 80 ? 'text-green-600' : seoScore >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'zh-TW' ? '部落格管理' : 'Blog Management'}
          </h2>
          <p className="text-gray-600 mt-1">
            {language === 'zh-TW' ? '管理您的部落格文章和SEO設定' : 'Manage your blog posts and SEO settings'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{language === 'zh-TW' ? '新增文章' : 'Add Post'}</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{blogs.length}</div>
          <div className="text-sm text-gray-600">{language === 'zh-TW' ? '總文章數' : 'Total Posts'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter(b => b.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600">{language === 'zh-TW' ? '已發布' : 'Published'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {blogs.filter(b => b.featured).length}
          </div>
          <div className="text-sm text-gray-600">{language === 'zh-TW' ? '精選文章' : 'Featured'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {blogs.reduce((sum, b) => sum + (b.view_count || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">{language === 'zh-TW' ? '總瀏覽量' : 'Total Views'}</div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'zh-TW' ? '文章' : 'Post'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'zh-TW' ? '狀態' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'zh-TW' ? '分類' : 'Category'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'zh-TW' ? '瀏覽量' : 'Views'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'zh-TW' ? '發布日期' : 'Published'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'zh-TW' ? '操作' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {language === 'zh-TW' ? '載入中...' : 'Loading...'}
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {language === 'zh-TW' ? '尚無文章' : 'No posts yet'}
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {blog.featured_image_url && (
                          <img 
                            src={blog.featured_image_url} 
                            alt={blog.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {blog.title}
                            {blog.featured && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {blog.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(blog.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.categories?.map((category) => (
                          <span key={category.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {blog.view_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(blog.published_at)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {language === 'zh-TW' ? '編輯' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {language === 'zh-TW' ? '刪除' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingBlog ? (language === 'zh-TW' ? '編輯文章' : 'Edit Post') : (language === 'zh-TW' ? '新增文章' : 'Add Post')}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '基本資訊' : 'Basic Information'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? '標題 *' : 'Title *'}
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={language === 'zh-TW' ? '輸入文章標題...' : 'Enter post title...'}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? '摘要' : 'Excerpt'}
                        </label>
                        <textarea
                          value={formData.excerpt}
                          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={language === 'zh-TW' ? '簡短描述文章內容...' : 'Brief description of the post...'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? '內容 *' : 'Content *'}
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          rows="12"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={language === 'zh-TW' ? '輸入文章內容...' : 'Enter post content...'}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {language === 'zh-TW' ? '支援 HTML 標籤' : 'HTML tags supported'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '媒體' : 'Media'}
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'zh-TW' ? '特色圖片 URL' : 'Featured Image URL'}
                      </label>
                      <input
                        type="url"
                        value={formData.featured_image_url}
                        onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.featured_image_url && (
                        <img 
                          src={formData.featured_image_url} 
                          alt="Preview"
                          className="mt-2 w-32 h-32 object-cover rounded-lg"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* SEO Settings */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {language === 'zh-TW' ? 'SEO 設定' : 'SEO Settings'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? 'SEO 標題' : 'SEO Title'}
                        </label>
                        <input
                          type="text"
                          value={formData.meta_title}
                          onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={formData.title || (language === 'zh-TW' ? 'SEO 標題...' : 'SEO title...')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? 'SEO 描述' : 'SEO Description'}
                        </label>
                        <textarea
                          value={formData.meta_description}
                          onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={formData.excerpt || (language === 'zh-TW' ? 'SEO 描述...' : 'SEO description...')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? '關鍵字' : 'Keywords'}
                        </label>
                        <input
                          type="text"
                          value={formData.meta_keywords}
                          onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={language === 'zh-TW' ? '關鍵字1, 關鍵字2, 關鍵字3' : 'keyword1, keyword2, keyword3'}
                        />
                      </div>

                      {/* SEO Score */}
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {language === 'zh-TW' ? 'SEO 分數' : 'SEO Score'}
                          </span>
                          <span className={`text-lg font-bold ${seoScoreColor}`}>
                            {seoScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${seoScore >= 80 ? 'bg-green-500' : seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${seoScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '搜尋結果預覽' : 'Search Result Preview'}
                    </h4>
                    
                    <div className="bg-white p-3 rounded border">
                      <div className="text-blue-600 text-sm mb-1">{seoPreview.url}</div>
                      <div className="text-lg text-blue-800 font-medium mb-1 line-clamp-1">{seoPreview.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">{seoPreview.description}</div>
                    </div>
                  </div>

                  {/* Publishing Settings */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '發布設定' : 'Publishing Settings'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? '狀態' : 'Status'}
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">{language === 'zh-TW' ? '草稿' : 'Draft'}</option>
                          <option value="published">{language === 'zh-TW' ? '已發布' : 'Published'}</option>
                          <option value="archived">{language === 'zh-TW' ? '已封存' : 'Archived'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'zh-TW' ? '分類' : 'Categories'}
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {categories.map((category) => (
                            <label key={category.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.category_ids.includes(category.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData, 
                                      category_ids: [...formData.category_ids, category.id]
                                    });
                                  } else {
                                    setFormData({
                                      ...formData, 
                                      category_ids: formData.category_ids.filter(id => id !== category.id)
                                    });
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {language === 'zh-TW' ? '設為精選文章' : 'Set as featured post'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {language === 'zh-TW' ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (language === 'zh-TW' ? '儲存中...' : 'Saving...') : (editingBlog ? (language === 'zh-TW' ? '更新' : 'Update') : (language === 'zh-TW' ? '發布' : 'Publish'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement; 