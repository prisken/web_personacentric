const { Gift, GiftCategory, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function seedGifts() {
  try {
    console.log('Starting gift seeding...');

    // Find admin user
    const adminUser = await User.findOne({ 
      where: { email: 'admin@personacentric.com' }
    });

    if (!adminUser) {
      throw new Error('Admin user not found. Please ensure admin user exists before creating gifts.');
    }

    // Create gift categories
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

    for (const category of categories) {
      const existingCategory = await GiftCategory.findOne({ where: { name: category.name } });
      if (!existingCategory) {
        await GiftCategory.create(category);
        console.log(`Gift category "${category.name}" created successfully`);
      } else {
        console.log(`Gift category "${category.name}" already exists, skipping...`);
      }
    }

    // Get all categories for reference
    const allCategories = await GiftCategory.findAll();
    const categoryMap = allCategories.reduce((map, cat) => {
      map[cat.name] = cat.id;
      return map;
    }, {});

    // Create gifts
    const gifts = [
      {
        id: uuidv4(),
        name: 'Apple AirPods Pro',
        description: '主動降噪無線耳機，提供卓越的音質和舒適度',
        category_id: categoryMap['電子產品'],
        image_url: 'https://res.cloudinary.com/personacentric/image/upload/v1/gifts/airpods-pro.jpg',
        points_required: 5000,
        stock_quantity: 10,
        status: 'active',
        display_order: 1,
        created_by: adminUser.id
      },
      {
        id: uuidv4(),
        name: '高級咖啡機',
        description: '專業級咖啡機，在家享受咖啡館品質的咖啡',
        category_id: categoryMap['生活用品'],
        image_url: 'https://res.cloudinary.com/personacentric/image/upload/v1/gifts/coffee-maker.jpg',
        points_required: 3000,
        stock_quantity: 5,
        status: 'active',
        display_order: 1,
        created_by: adminUser.id
      },
      {
        id: uuidv4(),
        name: 'HKD500 超市禮品卡',
        description: '可在各大超市使用的禮品卡',
        category_id: categoryMap['禮品卡'],
        image_url: 'https://res.cloudinary.com/personacentric/image/upload/v1/gifts/gift-card.jpg',
        points_required: 1000,
        stock_quantity: 50,
        status: 'active',
        display_order: 1,
        created_by: adminUser.id
      }
    ];

    for (const gift of gifts) {
      const existingGift = await Gift.findOne({ where: { name: gift.name } });
      if (!existingGift) {
        await Gift.create(gift);
        console.log(`Gift "${gift.name}" created successfully`);
      } else {
        console.log(`Gift "${gift.name}" already exists, skipping...`);
      }
    }

    console.log('Gift seeding completed successfully');
  } catch (error) {
    console.error('Gift seeding error:', error);
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}

module.exports = seedGifts;