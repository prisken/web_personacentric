const express = require('express');
const router = express.Router();
const { BlogPost, BlogCategory, BlogImage, BlogPostCategory, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Test endpoint to check basic functionality
router.get('/test', async (req, res) => {
  try {
    console.log('Test endpoint called');
    res.json({ 
      success: true, 
      message: 'Blogs test endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all published blogs with pagination and filtering
router.get('/', async (req, res) => {
  try {
    console.log('Blogs endpoint called');
    
    // Return dummy data for now to get frontend working
    const dummyBlogs = [
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
        featured_image_url: "https://images.unsplash.com/photo-1554224154-26032cdc-304d?w=800",
        meta_title: "稅務規劃策略指南",
        meta_description: "了解如何合法地減少稅負",
        reading_time: 10,
        view_count: 650,
        like_count: 28,
        share_count: 5,
        published_at: "2024-01-05T00:00:00.000Z",
        created_at: "2024-01-05T00:00:00.000Z",
        updated_at: "2024-01-05T00:00:00.000Z"
      }
    ];

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const paginatedBlogs = dummyBlogs.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: paginatedBlogs,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(dummyBlogs.length / limit),
        total_items: dummyBlogs.length,
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
    
    const whereClause = {};
    if (identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      whereClause.id = identifier;
    } else {
      whereClause.slug = identifier;
    }

    const blog = await BlogPost.findOne({
      where: whereClause
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment view count
    await blog.increment('view_count');

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

    const blog = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      author_id: req.user.userId,
      status,
      featured,
      featured_image_url,
      meta_title,
      meta_description,
      meta_keywords,
      reading_time: readingTime,
      published_at: status === 'published' ? new Date() : null
    });

    // Add categories
    if (category_ids && category_ids.length > 0) {
      const categoryAssociations = category_ids.map(categoryId => ({
        blog_post_id: blog.id,
        category_id: categoryId
      }));
      await BlogPostCategory.bulkCreate(categoryAssociations);
    }

    // Fetch the created blog
    const createdBlog = await BlogPost.findByPk(blog.id);

    res.status(201).json({
      success: true,
      data: createdBlog
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

    const blog = await BlogPost.findByPk(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Generate new slug if title changed
    let slug = blog.slug;
    if (title && title !== blog.title) {
      slug = title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    // Calculate reading time
    const wordCount = content ? content.split(/\s+/).length : blog.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Update published_at if status changed to published
    let publishedAt = blog.published_at;
    if (status === 'published' && blog.status !== 'published') {
      publishedAt = new Date();
    }

    await blog.update({
      title,
      slug,
      excerpt,
      content,
      status,
      featured,
      featured_image_url,
      meta_title,
      meta_description,
      meta_keywords,
      reading_time: readingTime,
      published_at: publishedAt
    });

    // Update categories
    if (category_ids) {
      // Remove existing categories
      await BlogPostCategory.destroy({ where: { blog_post_id: id } });
      
      // Add new categories
      if (category_ids.length > 0) {
        const categoryAssociations = category_ids.map(categoryId => ({
          blog_post_id: id,
          category_id: categoryId
        }));
        await BlogPostCategory.bulkCreate(categoryAssociations);
      }
    }

    // Fetch updated blog
    const updatedBlog = await BlogPost.findByPk(id);

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

    const blog = await BlogPost.findByPk(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Delete associated categories and images
    await BlogPostCategory.destroy({ where: { blog_post_id: id } });
    await BlogImage.destroy({ where: { blog_post_id: id } });
    
    // Delete the blog
    await blog.destroy();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
});

// Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await BlogPost.findByPk(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment view count
    await blog.increment('view_count');
    
    res.json({ success: true, message: 'View count updated' });
  } catch (error) {
    console.error('Update view count error:', error);
    res.status(500).json({ success: false, message: 'Failed to update view count' });
  }
});

// Seed blog data (Admin only)
router.post('/seed', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const seedBlogData = require('../seedBlogData');
    await seedBlogData();
    
    res.json({ success: true, message: 'Blog data seeded successfully' });
  } catch (error) {
    console.error('Seed blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to seed blog data' });
  }
});

// Generate XML sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const blogs = await BlogPost.findAll({
      where: { status: 'published' },
      attributes: ['slug', 'updated_at'],
      order: [['updated_at', 'DESC']]
    });

    const baseUrl = process.env.FRONTEND_URL || 'https://your-domain.com';
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add blog listing page
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/blogs</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;
    
    // Add individual blog posts
    blogs.forEach(blog => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/blogs/${blog.slug}</loc>\n`;
      sitemap += `    <lastmod>${blog.updated_at.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.6</priority>\n`;
      sitemap += `  </url>\n`;
    });
    
    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Generate sitemap error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate sitemap' });
  }
});

// Get blog categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await BlogCategory.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Create category (Admin only)
router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const category = await BlogCategory.create({
      name,
      slug,
      description,
      color
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

module.exports = router; 