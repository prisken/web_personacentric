const express = require('express');
const router = express.Router();
const { Gift, GiftCategory, User } = require('../models');
const { authenticateToken: auth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { uploadImage } = require('../utils/imageUpload');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Public endpoint to get active gifts
router.get('/public', async (req, res) => {
  try {
    console.log('Fetching public gifts...');
    const gifts = await Gift.findAll({
      where: { status: 'active' },
      include: [
        { model: GiftCategory, as: 'category' }
      ],
      order: [
        ['display_order', 'ASC'],
        ['created_at', 'DESC']
      ]
    });
    console.log('Found gifts:', gifts.length);
    console.log('Gift data:', gifts.map(gift => ({
      id: gift.id,
      name: gift.name,
      status: gift.status,
      image_url: gift.image_url,
      category: gift.category ? gift.category.name : null
    })));
    res.json(gifts);
  } catch (error) {
    console.error('Error fetching public gifts:', {
      message: error.message,
      stack: error.stack,
      details: error.original || error
    });
    res.status(500).json({ 
      error: 'Failed to fetch gifts',
      details: error.message
    });
  }
});

// Get all gifts with their categories (admin access)
router.get('/', auth, async (req, res) => {
  try {
    const gifts = await Gift.findAll({
      include: [
        { model: GiftCategory, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] }
      ],
      order: [
        ['display_order', 'ASC'],
        ['created_at', 'DESC']
      ]
    });
    res.json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({ error: 'Failed to fetch gifts' });
  }
});

// Get all gift categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await GiftCategory.findAll({
      order: [
        ['display_order', 'ASC'],
        ['name', 'ASC']
      ]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching gift categories:', error);
    res.status(500).json({ error: 'Failed to fetch gift categories' });
  }
});

// Create a new gift category
router.post('/categories', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create gift categories' });
    }

    const category = await GiftCategory.create({
      id: uuidv4(),
      ...req.body
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating gift category:', error);
    res.status(500).json({ error: 'Failed to create gift category' });
  }
});

// Update a gift category
router.put('/categories/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update gift categories' });
    }

    const category = await GiftCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Gift category not found' });
    }

    await category.update(req.body);
    res.json(category);
  } catch (error) {
    console.error('Error updating gift category:', error);
    res.status(500).json({ error: 'Failed to update gift category' });
  }
});

// Create a new gift with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create gifts' });
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      const result = await uploadImage(req.file, 'gifts');
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to upload gift image: ' + result.error
        });
      }
      
      imageUrl = result.url;
    }

    const gift = await Gift.create({
      id: uuidv4(),
      ...req.body,
      image_url: imageUrl,
      created_by: req.user.id
    });

    const giftWithRelations = await Gift.findByPk(gift.id, {
      include: [
        { model: GiftCategory, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });

    res.status(201).json(giftWithRelations);
  } catch (error) {
    console.error('Error creating gift:', error);
    res.status(500).json({ error: 'Failed to create gift' });
  }
});

// Update a gift with image upload
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update gifts' });
    }

    const gift = await Gift.findByPk(req.params.id);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    // Handle image upload if provided
    let imageUrl = gift.image_url; // Keep existing image if no new one provided
    if (req.file) {
      const result = await uploadImage(req.file, 'gifts');
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to upload gift image: ' + result.error
        });
      }
      
      imageUrl = result.url;
    }

    await gift.update({
      ...req.body,
      image_url: imageUrl
    });

    const updatedGift = await Gift.findByPk(gift.id, {
      include: [
        { model: GiftCategory, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });

    res.json(updatedGift);
  } catch (error) {
    console.error('Error updating gift:', error);
    res.status(500).json({ error: 'Failed to update gift' });
  }
});

// Delete a gift
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete gifts' });
    }

    const gift = await Gift.findByPk(req.params.id);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    await gift.destroy();
    res.json({ message: 'Gift deleted successfully' });
  } catch (error) {
    console.error('Error deleting gift:', error);
    res.status(500).json({ error: 'Failed to delete gift' });
  }
});

// Seed gifts
router.post('/seed', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can seed gifts' });
    }

    // Create gift categories if they don't exist
    const categories = [
      {
        id: uuidv4(),
        name: '電子產品',
        description: '各種電子產品和配件',
        status: 'active',
        display_order: 1
      },
      {
        id: uuidv4(),
        name: '生活用品',
        description: '日常生活必需品和家居用品',
        status: 'active',
        display_order: 2
      },
      {
        id: uuidv4(),
        name: '禮品卡',
        description: '各種商店和服務的禮品卡',
        status: 'active',
        display_order: 3
      }
    ];

    const createdCategories = await Promise.all(
      categories.map(category => 
        GiftCategory.findOrCreate({
          where: { name: category.name },
          defaults: category
        })
      )
    );

    // Create demo gifts
    const gifts = [
      {
        id: uuidv4(),
        name: 'HKD500 超市禮品卡',
        description: '可在各大超市使用的禮品卡',
        category_id: createdCategories[2][0].id,
        points_required: 1000,
        stock_quantity: 100,
        status: 'active',
        created_by: req.user.id,
        image_url: 'https://res.cloudinary.com/personacentric/image/upload/v1/gifts/gift-card.jpg'
      },
      {
        id: uuidv4(),
        name: '高級咖啡機',
        description: '專業級咖啡機，在家享受咖啡館品質的咖啡',
        category_id: createdCategories[1][0].id,
        points_required: 3000,
        stock_quantity: 50,
        status: 'active',
        created_by: req.user.id,
        image_url: 'https://res.cloudinary.com/personacentric/image/upload/v1/gifts/coffee-machine.jpg'
      },
      {
        id: uuidv4(),
        name: 'Apple AirPods Pro',
        description: '主動降噪無線耳機，提供卓越的音質和舒適度',
        category_id: createdCategories[0][0].id,
        points_required: 5000,
        stock_quantity: 30,
        status: 'active',
        created_by: req.user.id,
        image_url: 'https://res.cloudinary.com/personacentric/image/upload/v1/gifts/airpods-pro.jpg'
      }
    ];

    await Promise.all(
      gifts.map(gift =>
        Gift.findOrCreate({
          where: { name: gift.name },
          defaults: gift
        })
      )
    );

    res.json({ message: 'Demo gifts seeded successfully' });
  } catch (error) {
    console.error('Error seeding gifts:', error);
    res.status(500).json({ error: 'Failed to seed gifts' });
  }
});

// Delete a gift category
router.delete('/categories/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete gift categories' });
    }

    const category = await GiftCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Gift category not found' });
    }

    await category.destroy();
    res.json({ message: 'Gift category deleted successfully' });
  } catch (error) {
    console.error('Error deleting gift category:', error);
    res.status(500).json({ error: 'Failed to delete gift category' });
  }
});

module.exports = router;