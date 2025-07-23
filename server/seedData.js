const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function seedData() {
  try {
    console.log('Starting simplified data seeding...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@personacentric.com' } });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
    } else {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
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

    // Create agent users
    const agentEmails = [
      'agent1@personacentric.com',
      'agent2@personacentric.com',
      'sarah.johnson@personacentric.com',
      'michael.chen@personacentric.com',
      'emily.rodriguez@personacentric.com',
      'kenji.tanaka@personacentric.com',
      'lucy.wong@personacentric.com',
      'alexander.smith@personacentric.com',
      'mei.lin@personacentric.com'
    ];

    const agentData = [
      { first_name: '張', last_name: '顧問', phone: '+852-2345-6789', points: 1500 },
      { first_name: '李', last_name: '顧問', phone: '+852-3456-7890', points: 2200 },
      { first_name: 'Sarah', last_name: 'Johnson', phone: '+852-1111-2222', points: 1800 },
      { first_name: 'Michael', last_name: 'Chen', phone: '+852-2222-3333', points: 2000 },
      { first_name: 'Emily', last_name: 'Rodriguez', phone: '+852-3333-4444', points: 1600 },
      { first_name: 'Kenji', last_name: 'Tanaka', phone: '+852-4444-5555', points: 1700 },
      { first_name: 'Lucy', last_name: 'Wong', phone: '+852-5555-6666', points: 1900 },
      { first_name: 'Alexander', last_name: 'Smith', phone: '+852-6666-7777', points: 2500 },
      { first_name: 'Mei', last_name: 'Lin', phone: '+852-7777-8888', points: 1400 }
    ];

    for (let i = 0; i < agentEmails.length; i++) {
      const existingAgent = await User.findOne({ where: { email: agentEmails[i] } });
      if (!existingAgent) {
        const agentPassword = await bcrypt.hash('agent123', 10);
        await User.create({
          email: agentEmails[i],
          password_hash: agentPassword,
          first_name: agentData[i].first_name,
          last_name: agentData[i].last_name,
          phone: agentData[i].phone,
          role: 'agent',
          language_preference: i < 2 ? 'zh-TW' : 'en',
          points: agentData[i].points,
          subscription_status: 'active',
          is_verified: true
        });
        console.log(`Agent ${agentData[i].first_name} ${agentData[i].last_name} created successfully`);
      } else {
        console.log(`Agent ${agentData[i].first_name} ${agentData[i].last_name} already exists, skipping...`);
      }
    }

    console.log('Simplified user seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

module.exports = seedData; 