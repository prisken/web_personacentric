const express = require('express');
const router = express.Router();
const { BlogPost, BlogCategory, BlogImage, BlogPostCategory, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

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
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (featured) {
      whereClause.featured = featured === 'true';
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const include = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image_url']
      },
      {
        model: BlogCategory,
        as: 'categories',
        through: { attributes: [] }
      },
      {
        model: BlogImage,
        as: 'images',
        where: { image_type: 'featured' },
        required: false
      }
    ];

    const { count, rows: blogs } = await BlogPost.findAndCountAll({
      where: whereClause,
      include,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.json({
      success: true,
      data: blogs,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
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
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image_url']
        },
        {
          model: BlogCategory,
          as: 'categories',
          through: { attributes: [] }
        },
        {
          model: BlogImage,
          as: 'images',
          order: [['display_order', 'ASC']]
        }
      ]
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

    // Fetch the created blog with associations
    const createdBlog = await BlogPost.findByPk(blog.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image_url']
        },
        {
          model: BlogCategory,
          as: 'categories',
          through: { attributes: [] }
        }
      ]
    });

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

    // Fetch updated blog with associations
    const updatedBlog = await BlogPost.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image_url']
        },
        {
          model: BlogCategory,
          as: 'categories',
          through: { attributes: [] }
        }
      ]
    });

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