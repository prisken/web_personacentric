const { User } = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createTestUsers() {
  try {
    console.log('Creating test users...');

    // Check if client user already exists
    const existingClient = await User.findOne({ where: { email: 'client1@personacentric.com' } });
    if (existingClient) {
      console.log('Client user already exists, skipping...');
    } else {
      // Create client user
      const clientPassword = await bcrypt.hash('client123', 10);
      await User.create({
        id: uuidv4(),
        email: 'client1@personacentric.com',
        password_hash: clientPassword,
        first_name: '王',
        last_name: '客戶',
        phone: '+852-9876-5432',
        role: 'client',
        language_preference: 'zh-TW',
        points: 500,
        subscription_status: 'active',
        is_verified: true
      });
      console.log('Client user created successfully');
    }

    console.log('Test users creation completed');
  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
  }
}

module.exports = createTestUsers;

// Run if called directly
if (require.main === module) {
  createTestUsers()
    .then(() => {
      console.log('Test users created successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create test users:', error);
      process.exit(1);
    });
} 