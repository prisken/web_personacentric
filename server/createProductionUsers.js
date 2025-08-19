const { User, Agent } = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createProductionUsers() {
  try {
    console.log('Creating production test users...');
    console.log('Environment:', process.env.NODE_ENV);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@personacentric.com' } });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
    } else {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        id: uuidv4(),
        email: 'admin@personacentric.com',
        password_hash: adminPassword,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+852-1234-5678',
        role: 'admin',
        language_preference: 'zh-TW',
        points: 0,
        subscription_status: 'active',
        is_verified: true
      });
      console.log('Admin user created successfully');
    }

    // Check if agent1 exists
    const existingAgent1 = await User.findOne({ where: { email: 'agent1@personacentric.com' } });
    if (existingAgent1) {
      console.log('Agent1 user already exists, skipping...');
    } else {
      // Create agent1 user
      const agent1Password = await bcrypt.hash('agent123', 10);
      const agent1 = await User.create({
        id: uuidv4(),
        email: 'agent1@personacentric.com',
        password_hash: agent1Password,
        first_name: '張',
        last_name: '顧問',
        phone: '+852-2345-6789',
        role: 'agent',
        language_preference: 'zh-TW',
        points: 1500,
        subscription_status: 'active',
        is_verified: true
      });
      console.log('Agent1 user created successfully');

      // Create agent profile
      await Agent.create({
        user_id: agent1.id,
        specialization: '投資規劃',
        experience_years: 5,
        certifications: 'CFP, CFA',
        bio: '專注於個人投資規劃和退休規劃',
        commission_rate: 0.15,
        is_verified: true,
        rating: 4.5,
        total_reviews: 10,
        areas_of_expertise: JSON.stringify(['退休規劃', '投資組合管理', '風險管理']),
        languages: JSON.stringify(['zh-TW', 'en']),
        preferred_client_types: JSON.stringify(['個人投資者', '小型企業']),
        communication_modes: JSON.stringify(['面對面', '視訊會議']),
        availability: '{"weekdays": ["09:00-18:00"], "weekends": ["10:00-15:00"]}',
        location: '香港中環',
        status: 'approved',
        in_matching_pool: true
      });
      console.log('Agent1 profile created successfully');
    }

    // Check if client1 exists
    const existingClient1 = await User.findOne({ where: { email: 'client1@personacentric.com' } });
    if (existingClient1) {
      console.log('Client1 user already exists, skipping...');
    } else {
      // Create client1 user
      const client1Password = await bcrypt.hash('client123', 10);
      await User.create({
        id: uuidv4(),
        email: 'client1@personacentric.com',
        password_hash: client1Password,
        first_name: '王',
        last_name: '客戶',
        phone: '+852-9876-5432',
        role: 'client',
        language_preference: 'zh-TW',
        points: 500,
        subscription_status: 'active',
        is_verified: true
      });
      console.log('Client1 user created successfully');
    }

    console.log('Production test users creation completed');
  } catch (error) {
    console.error('Error creating production test users:', error);
    throw error;
  }
}

module.exports = createProductionUsers;

// Run if called directly
if (require.main === module) {
  createProductionUsers()
    .then(() => {
      console.log('Production test users created successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create production test users:', error);
      process.exit(1);
    });
} 