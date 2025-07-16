const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Define basic User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'agent', 'client'),
    defaultValue: 'client'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  subscription_status: {
    type: DataTypes.ENUM('active', 'inactive', 'grace_period'),
    defaultValue: 'inactive'
  }
}, {
  tableName: 'users',
  timestamps: true
});

async function seedData() {
  try {
    console.log('Starting simple data seeding...');

    // Sync database
    await sequelize.sync({ force: true });

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@personacentric.com',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      points: 0,
      subscription_status: 'active'
    });

    // Create agent users
    const agent1Password = await bcrypt.hash('agent123', 10);
    const agent1 = await User.create({
      email: 'agent1@personacentric.com',
      password_hash: agent1Password,
      first_name: '張',
      last_name: '顧問',
      role: 'agent',
      points: 1500,
      subscription_status: 'active'
    });

    const agent2Password = await bcrypt.hash('agent123', 10);
    const agent2 = await User.create({
      email: 'agent2@personacentric.com',
      password_hash: agent2Password,
      first_name: '李',
      last_name: '顧問',
      role: 'agent',
      points: 2200,
      subscription_status: 'active'
    });

    // Create client users
    const client1Password = await bcrypt.hash('client123', 10);
    const client1 = await User.create({
      email: 'client1@personacentric.com',
      password_hash: client1Password,
      first_name: '王',
      last_name: '客戶',
      role: 'client',
      points: 800,
      subscription_status: 'active'
    });

    const client2Password = await bcrypt.hash('client123', 10);
    const client2 = await User.create({
      email: 'client2@personacentric.com',
      password_hash: client2Password,
      first_name: '陳',
      last_name: '客戶',
      role: 'client',
      points: 1200,
      subscription_status: 'active'
    });

    console.log('Simple data seeding completed successfully!');
    console.log('Sample users created:');
    console.log('Admin: admin@personacentric.com / admin123');
    console.log('Agent 1: agent1@personacentric.com / agent123');
    console.log('Agent 2: agent2@personacentric.com / agent123');
    console.log('Client 1: client1@personacentric.com / client123');
    console.log('Client 2: client2@personacentric.com / client123');

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

// Run seeding
seedData().then(() => {
  console.log('Seeding completed');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
}); 