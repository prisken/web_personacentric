// Railway Console Script - Run this in Railway console
// Copy and paste this entire script into Railway console

const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// User model definition
const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  first_name: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING(20),
    allowNull: true
  },
  role: {
    type: Sequelize.ENUM('admin', 'agent', 'client'),
    defaultValue: 'client'
  },
  language_preference: {
    type: Sequelize.ENUM('en', 'zh-TW'),
    defaultValue: 'zh-TW'
  },
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  subscription_status: {
    type: Sequelize.ENUM('active', 'inactive', 'grace_period'),
    defaultValue: 'inactive'
  },
  is_verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Agent model definition
const Agent = sequelize.define('Agent', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  specialization: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  experience_years: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  certifications: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  bio: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  commission_rate: {
    type: Sequelize.DECIMAL(5, 4),
    allowNull: false
  },
  is_verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: Sequelize.DECIMAL(3, 2),
    allowNull: true
  },
  total_reviews: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  areas_of_expertise: {
    type: Sequelize.JSON,
    allowNull: true
  },
  languages: {
    type: Sequelize.JSON,
    allowNull: true
  },
  preferred_client_types: {
    type: Sequelize.JSON,
    allowNull: true
  },
  communication_modes: {
    type: Sequelize.JSON,
    allowNull: true
  },
  availability: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  location: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('pending', 'approved', 'active', 'inactive'),
    defaultValue: 'pending'
  },
  in_matching_pool: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'agents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Main function to create test users
async function createTestUsers() {
  try {
    console.log('🚀 Starting test user creation...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@personacentric.com' } });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists, skipping...');
    } else {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
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
      console.log('✅ Admin user created successfully:', admin.email);
    }

    // Check if agent1 exists
    const existingAgent1 = await User.findOne({ where: { email: 'agent1@personacentric.com' } });
    if (existingAgent1) {
      console.log('⚠️ Agent1 user already exists, skipping...');
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
      console.log('✅ Agent1 user created successfully:', agent1.email);

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
      console.log('✅ Agent1 profile created successfully');
    }

    // Check if client1 exists
    const existingClient1 = await User.findOne({ where: { email: 'client1@personacentric.com' } });
    if (existingClient1) {
      console.log('⚠️ Client1 user already exists, skipping...');
    } else {
      // Create client1 user
      const client1Password = await bcrypt.hash('client123', 10);
      const client1 = await User.create({
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
      console.log('✅ Client1 user created successfully:', client1.email);
    }

    // Get final user count
    const userCount = await User.count();
    console.log(`🎉 Test users creation completed! Total users: ${userCount}`);
    
    console.log('\n📋 Test User Credentials:');
    console.log('Admin: admin@personacentric.com / admin123');
    console.log('Agent: agent1@personacentric.com / agent123');
    console.log('Client: client1@personacentric.com / client123');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the function
createTestUsers()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }); 