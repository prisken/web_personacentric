const { User, Agent } = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createAllMissingUsers() {
  try {
    console.log('🚀 Creating all missing users to match seed data...');
    console.log('Environment:', process.env.NODE_ENV);

    // All users from seedData.js
    const allUsers = [
      // Admin (already exists in production)
      {
        email: 'admin@personacentric.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        phone: '+852-1234-5678',
        role: 'admin',
        points: 0
      },
      
      // 9 Agents
      {
        email: 'agent1@personacentric.com',
        password: 'agent123',
        first_name: '張',
        last_name: '顧問',
        phone: '+852-2345-6789',
        role: 'agent',
        points: 1500
      },
      {
        email: 'agent2@personacentric.com',
        password: 'agent123',
        first_name: '李',
        last_name: '顧問',
        phone: '+852-3456-7890',
        role: 'agent',
        points: 2200
      },
      {
        email: 'sarah.johnson@personacentric.com',
        password: 'agent123',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '+852-1111-2222',
        role: 'agent',
        points: 1800
      },
      {
        email: 'michael.chen@personacentric.com',
        password: 'agent123',
        first_name: 'Michael',
        last_name: 'Chen',
        phone: '+852-2222-3333',
        role: 'agent',
        points: 2000
      },
      {
        email: 'emily.rodriguez@personacentric.com',
        password: 'agent123',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        phone: '+852-3333-4444',
        role: 'agent',
        points: 1600
      },
      {
        email: 'kenji.tanaka@personacentric.com',
        password: 'agent123',
        first_name: 'Kenji',
        last_name: 'Tanaka',
        phone: '+852-4444-5555',
        role: 'agent',
        points: 1700
      },
      {
        email: 'lucy.wong@personacentric.com',
        password: 'agent123',
        first_name: 'Lucy',
        last_name: 'Wong',
        phone: '+852-5555-6666',
        role: 'agent',
        points: 1900
      },
      {
        email: 'alexander.smith@personacentric.com',
        password: 'agent123',
        first_name: 'Alexander',
        last_name: 'Smith',
        phone: '+852-6666-7777',
        role: 'agent',
        points: 2500
      },
      {
        email: 'mei.lin@personacentric.com',
        password: 'agent123',
        first_name: 'Mei',
        last_name: 'Lin',
        phone: '+852-7777-8888',
        role: 'agent',
        points: 1400
      },
      
      // 2 Clients
      {
        email: 'client1@personacentric.com',
        password: 'client123',
        first_name: '王',
        last_name: '客戶',
        phone: '+852-9876-5432',
        role: 'client',
        points: 500
      },
      {
        email: 'client2@personacentric.com',
        password: 'client123',
        first_name: '陳',
        last_name: '客戶',
        phone: '+852-8765-4321',
        role: 'client',
        points: 550
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of allUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        skippedCount++;
        continue;
      }

      // Create user
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        id: uuidv4(),
        email: userData.email,
        password_hash: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role,
        language_preference: userData.role === 'agent' && userData.first_name.length <= 3 ? 'zh-TW' : 'en',
        points: userData.points,
        subscription_status: 'active',
        is_verified: true
      });

      console.log(`✅ Created user: ${userData.first_name} ${userData.last_name} (${userData.email})`);
      createdCount++;

      // Create agent profile for agents
      if (userData.role === 'agent') {
        await Agent.create({
          user_id: user.id,
          specialization: userData.first_name === '張' ? '投資理財' : 
                         userData.first_name === '李' ? '保險規劃' : '綜合理財',
          experience_years: Math.floor(Math.random() * 10) + 3,
          certifications: 'CFP, CFA',
          bio: `專業${userData.first_name === '張' ? '投資' : userData.first_name === '李' ? '保險' : '理財'}顧問`,
          commission_rate: 0.1 + Math.random() * 0.1,
          is_verified: true,
          rating: 4.0 + Math.random() * 1.0,
          total_reviews: Math.floor(Math.random() * 50) + 10,
          areas_of_expertise: JSON.stringify(['退休規劃', '投資組合管理', '風險管理']),
          languages: JSON.stringify(['zh-TW', 'en']),
          preferred_client_types: JSON.stringify(['個人投資者', '小型企業']),
          communication_modes: JSON.stringify(['面對面', '視訊會議']),
          availability: '{"weekdays": ["09:00-18:00"], "weekends": ["10:00-15:00"]}',
          location: '香港中環',
          status: 'approved',
          in_matching_pool: true
        });
        console.log(`✅ Created agent profile for: ${userData.first_name} ${userData.last_name}`);
      }
    }

    // Get final user count
    const totalUsers = await User.count();
    const userCounts = await User.findAll({
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['role']
    });

    console.log(`\n🎉 User creation completed!`);
    console.log(`📊 Summary:`);
    console.log(`   - Created: ${createdCount} users`);
    console.log(`   - Skipped: ${skippedCount} users (already exist)`);
    console.log(`   - Total users in database: ${totalUsers}`);
    
    console.log(`\n📋 User counts by role:`);
    userCounts.forEach(count => {
      console.log(`   - ${count.role}: ${count.dataValues.count} users`);
    });

    console.log(`\n🔑 All users can now login with their respective passwords:`);
    console.log(`   - Super Admin: superadmin@personacentric.com / superadmin123`);
    console.log(`   - Admin: admin@personacentric.com / admin123`);
    console.log(`   - Agents: [email] / agent123`);
    console.log(`   - Clients: [email] / client123`);

  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
}

module.exports = createAllMissingUsers;

// Run if called directly
if (require.main === module) {
  createAllMissingUsers()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}
