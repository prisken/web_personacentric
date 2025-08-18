const { User, Quiz } = require('./models');
const { seedQuizzes } = require('./seedData/quizSeeds');

async function seedQuizData() {
  try {
    console.log('🌱 Starting quiz seeding...');
    
    // Find admin user
    const adminUser = await User.findOne({ 
      where: { email: 'admin@personacentric.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Please ensure admin user exists.');
      return;
    }

    console.log('✅ Found admin user with ID:', adminUser.id);
    
    // Seed quizzes
    await seedQuizzes(adminUser.id);
    
    console.log('✅ Quiz seeding completed successfully');
  } catch (error) {
    console.error('❌ Quiz seeding error:', error);
  }
}

// Run the seeding
seedQuizData(); 