const { sequelize } = require('./models');
const seedBlogData = require('./seedBlogData');

async function seedBlogs() {
  try {
    console.log('🌱 Starting blog seeding...');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synced');
    
    // Seed blog data
    await seedBlogData();
    
    console.log('🎉 Blog seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Blog seeding failed:', error);
    process.exit(1);
  }
}

seedBlogs(); 