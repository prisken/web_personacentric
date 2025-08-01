const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// In-memory storage for blog data (persists during server session)
let blogData = [
  {
    id: "1",
    title: "2024年投資策略:您需要知道的",
    slug: "2024-investment-strategy",
    excerpt: "探索2024年最有效的投資策略,包括股票、債券、房地產和另類投資的完整指南。",
    content: "這是一篇關於2024年投資策略的詳細文章...",
    author_id: "admin-user",
    status: "published",
    featured_image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    meta_title: "2024年投資策略完整指南",
    meta_description: "探索2024年最有效的投資策略",
    reading_time: 8,
    view_count: 1250,
    like_count: 45,
    share_count: 12,
    published_at: "2024-01-15T00:00:00.000Z",
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "2",
    title: "退休規劃的完整指南",
    slug: "retirement-planning-guide",
    excerpt: "從現在開始規劃您的退休生活，確保財務安全和舒適的退休生活。",
    content: "退休規劃是人生最重要的財務決策之一...",
    author_id: "admin-user",
    status: "published",
    featured_image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    meta_title: "退休規劃完整指南",
    meta_description: "從現在開始規劃您的退休生活",
    reading_time: 12,
    view_count: 890,
    like_count: 32,
    share_count: 8,
    published_at: "2024-01-10T00:00:00.000Z",
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: "2024-01-10T00:00:00.000Z"
  },
  {
    id: "3",
    title: "稅務規劃策略",
    slug: "tax-planning-strategies",
    excerpt: "了解如何合法地減少稅負，最大化您的稅後收入。",
    content: "稅務規劃是財務規劃的重要組成部分...",
    author_id: "admin-user",
    status: "published",
    featured_image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    meta_title: "稅務規劃策略指南",
    meta_description: "了解如何合法地減少稅負",
    reading_time: 10,
    view_count: 650,
    like_count: 28,
    share_count: 5,
    published_at: "2024-01-05T00:00:00.000Z",
    created_at: "2024-01-05T00:00:00.000Z",
    updated_at: "2024-01-05T00:00:00.000Z"
  },
  {
    id: "4",
    title: "保險規劃指南",
    slug: "insurance-planning-guide",
    excerpt: "選擇適合的保險產品，保護您和家人的財務安全。",
    content: "保險是財務規劃中不可或缺的一部分...",
    author_id: "admin-user",
    status: "draft",
    featured_image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    meta_title: "保險規劃完整指南",
    meta_description: "選擇適合的保險產品",
    reading_time: 8,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    published_at: null,
    created_at: "2024-01-20T00:00:00.000Z",
    updated_at: "2024-01-20T00:00:00.000Z"
  },
  {
    id: "5",
    title: "房地產投資策略",
    slug: "real-estate-investment-strategies",
    excerpt: "了解房地產投資的各種策略和風險管理方法。",
    content: "房地產投資是許多投資者的首選...",
    author_id: "admin-user",
    status: "draft",
    featured_image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    meta_title: "房地產投資策略指南",
    meta_description: "了解房地產投資的各種策略",
    reading_time: 15,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    published_at: null,
    created_at: "2024-01-18T00:00:00.000Z",
    updated_at: "2024-01-18T00:00:00.000Z"
  }
];

// Get all published blogs with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      featured,
      status = 'published' 
    } = req.query;
    
    // Filter blogs by status
    let filteredBlogs = blogData;
    if (status && status !== 'all') {
      filteredBlogs = blogData.filter(blog => blog.status === status);
    }

    const offset = (page - 1) * limit;
    const paginatedBlogs = filteredBlogs.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: paginatedBlogs,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(filteredBlogs.length / limit),
        total_items: filteredBlogs.length,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blogs'
    });
  }
});

// Get blog by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Find blog by ID or slug
    let blog = null;
    if (identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      blog = blogData.find(b => b.id === identifier);
    } else {
      blog = blogData.find(b => b.slug === identifier);
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment view count
    blog.view_count += 1;

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
});

// Create new blog (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      excerpt, 
      content, 
      category_ids, 
      featured_image_url,
      meta_title,
      meta_description,
      meta_keywords,
      status = 'draft',
      featured = false
    } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Create new blog and add to in-memory storage
    const newBlog = {
      id: Date.now().toString(),
      title,
      slug,
      excerpt,
      content,
      author_id: req.user.userId,
      status,
      featured_image_url,
      meta_title,
      meta_description,
      meta_keywords,
      reading_time: readingTime,
      view_count: 0,
      like_count: 0,
      share_count: 0,
      published_at: status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to in-memory storage
    blogData.push(newBlog);

    res.status(201).json({
      success: true,
      data: newBlog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to create blog' });
  }
});

// Update blog (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      excerpt, 
      content, 
      category_ids, 
      featured_image_url,
      meta_title,
      meta_description,
      meta_keywords,
      status,
      featured
    } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // Find the blog in in-memory storage
    const blogIndex = blogData.findIndex(b => b.id === id);
    if (blogIndex === -1) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const existingBlog = blogData[blogIndex];

    // Generate new slug if title changed
    let slug = existingBlog.slug;
    if (title && title !== existingBlog.title) {
      slug = title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    // Calculate reading time
    const wordCount = content ? content.split(/\s+/).length : existingBlog.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Update published_at if status changed to published
    let publishedAt = existingBlog.published_at;
    if (status === 'published' && existingBlog.status !== 'published') {
      publishedAt = new Date().toISOString();
    }

    // Update the blog in in-memory storage
    const updatedBlog = {
      ...existingBlog,
      title: title || existingBlog.title,
      slug,
      excerpt: excerpt || existingBlog.excerpt,
      content: content || existingBlog.content,
      status: status || existingBlog.status,
      featured_image_url: featured_image_url || existingBlog.featured_image_url,
      meta_title: meta_title || existingBlog.meta_title,
      meta_description: meta_description || existingBlog.meta_description,
      meta_keywords: meta_keywords || existingBlog.meta_keywords,
      reading_time: readingTime,
      published_at: publishedAt,
      updated_at: new Date().toISOString()
    };

    // Update in in-memory storage
    blogData[blogIndex] = updatedBlog;

    res.json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to update blog' });
  }
});

// Delete blog (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // Find and remove the blog from in-memory storage
    const blogIndex = blogData.findIndex(b => b.id === id);
    if (blogIndex === -1) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Remove from in-memory storage
    blogData.splice(blogIndex, 1);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
});

// Increment blog view count
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the blog in in-memory storage
    const blog = blogData.find(b => b.id === id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment view count
    blog.view_count = (blog.view_count || 0) + 1;

    res.json({
      success: true,
      data: { view_count: blog.view_count }
    });
  } catch (error) {
    console.error('Increment view count error:', error);
    res.status(500).json({ success: false, message: 'Failed to increment view count' });
  }
});

// Get all blog categories
router.get('/categories/all', async (req, res) => {
  try {
    // Return dummy categories for now
    const categories = [
      { id: 1, name: '投資', slug: 'investment' },
      { id: 2, name: '退休', slug: 'retirement' },
      { id: 3, name: '稅務規劃', slug: 'tax-planning' },
      { id: 4, name: '保險', slug: 'insurance' },
      { id: 5, name: '房地產', slug: 'real-estate' },
      { id: 6, name: '財務規劃', slug: 'financial-planning' },
      { id: 7, name: '市場分析', slug: 'market-analysis' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Seed blog data (Admin only)
router.post('/seed', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    res.json({
      success: true,
      message: 'Blog data seeded successfully'
    });
  } catch (error) {
    console.error('Seed blogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to seed blogs' });
  }
});

module.exports = router; 