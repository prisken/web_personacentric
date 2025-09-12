// Railway Console Script to populate production database with all users
// Run this script in Railway's console to add all missing users

const { User, Agent } = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function populateProductionDatabase() {
  try {
    console.log('🚀 Populating production database with all users...');
    
    // Define all users to create
    const usersToCreate = [
      // Super Admin
      {
        email: 'superadmin@personacentric.com',
        password: 'superadmin123',
        first_name: 'Super',
        last_name: 'Admin',
        phone: '+852-0000-0000',
        role: 'super_admin',
        points: 0,
        permissions: { super_admin: true }
      },
      // Admin
      {
        email: 'admin@personacentric.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        phone: '+852-1234-5678',
        role: 'admin',
        points: 0
      },
      // Agents
      {
        email: 'agent1@personacentric.com',
        password: 'agent123',
        first_name: '張',
        last_name: '顧問',
        phone: '+852-2345-6789',
        role: 'agent',
        points: 0
      },
      {
        email: 'agent2@personacentric.com',
        password: 'agent123',
        first_name: '李',
        last_name: '顧問',
        phone: '+852-3456-7890',
        role: 'agent',
        points: 0
      },
      {
        email: 'sarah.johnson@personacentric.com',
        password: 'agent123',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '+852-4567-8901',
        role: 'agent',
        points: 1805
      },
      {
        email: 'michael.chen@personacentric.com',
        password: 'agent123',
        first_name: 'Michael',
        last_name: 'Chen',
        phone: '+852-5678-9012',
        role: 'agent',
        points: 0
      },
      {
        email: 'emily.rodriguez@personacentric.com',
        password: 'agent123',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        phone: '+852-6789-0123',
        role: 'agent',
        points: 0
      },
      {
        email: 'kenji.tanaka@personacentric.com',
        password: 'agent123',
        first_name: 'Kenji',
        last_name: 'Tanaka',
        phone: '+852-7890-1234',
        role: 'agent',
        points: 0
      },
      {
        email: 'lucy.wong@personacentric.com',
        password: 'agent123',
        first_name: 'Lucy',
        last_name: 'Wong',
        phone: '+852-8901-2345',
        role: 'agent',
        points: 0
      },
      {
        email: 'alexander.smith@personacentric.com',
        password: 'agent123',
        first_name: 'Alexander',
        last_name: 'Smith',
        phone: '+852-9012-3456',
        role: 'agent',
        points: 0
      },
      {
        email: 'mei.lin@personacentric.com',
        password: 'agent123',
        first_name: 'Mei',
        last_name: 'Lin',
        phone: '+852-0123-4567',
        role: 'agent',
        points: 0
      },
      // Clients
      {
        email: 'client1@personacentric.com',
        password: 'client123',
        first_name: '王',
        last_name: '客戶',
        phone: '+852-9876-5432',
        role: 'client',
        points: 555
      },
      {
        email: 'client2@personacentric.com',
        password: 'client123',
        first_name: '陳',
        last_name: '客戶',
        phone: '+852-8765-4321',
        role: 'client',
        points: 10
      },
      {
        email: 'client1@test.com',
        password: 'client123',
        first_name: '王',
        last_name: '小明',
        phone: '+852-7654-3210',
        role: 'client',
        points: 0
      },
      {
        email: 'client2@test.com',
        password: 'client123',
        first_name: '陳',
        last_name: '美玲',
        phone: '+852-6543-2109',
        role: 'client',
        points: 0
      },
      {
        email: 'client3@test.com',
        password: 'client123',
        first_name: 'John',
        last_name: 'Smith',
        phone: '+852-5432-1098',
        role: 'client',
        points: 0
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of usersToCreate) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: userData.email } });
        
        if (existingUser) {
          console.log(`⏭️  User ${userData.email} already exists, skipping...`);
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
          language_preference: 'zh-TW',
          points: userData.points,
          subscription_status: 'active',
          is_verified: true,
          permissions: userData.permissions || {}
        });

        console.log(`✅ Created user: ${userData.first_name} ${userData.last_name} (${userData.email}) - ${userData.role}`);
        createdCount++;

      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log(`\n🎉 Production database population completed!`);
    console.log(`📊 Summary: ${createdCount} users created, ${skippedCount} users skipped`);

    // Verify final counts
    const totalUsers = await User.count();
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['role']
    });

    console.log(`\n📈 Final database state:`);
    console.log(`Total users: ${totalUsers}`);
    usersByRole.forEach(row => {
      console.log(`  ${row.role}: ${row.dataValues.count} users`);
    });

  } catch (error) {
    console.error('❌ Error populating production database:', error);
    throw error;
  }
}

// Export for use in Railway console
module.exports = populateProductionDatabase;

// Run if called directly
if (require.main === module) {
  populateProductionDatabase()
    .then(() => {
      console.log('✅ Production database populated successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to populate production database:', error);
      process.exit(1);
    });
}