const express = require('express');
const router = express.Router();
const { Gift, GiftCategory, User } = require('../models');
const { authenticateToken: auth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all gifts with their categories
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

// Create a new gift
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create gifts' });
    }

    const gift = await Gift.create({
      id: uuidv4(),
      ...req.body,
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

// Update a gift
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update gifts' });
    }

    const gift = await Gift.findByPk(req.params.id);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    await gift.update(req.body);

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