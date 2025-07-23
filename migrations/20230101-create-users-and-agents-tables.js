module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create users table
    await queryInterface.createTable('users', {
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
      subscription_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      grace_period_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      verification_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      reset_password_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      reset_password_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['subscription_status']);
    await queryInterface.addIndex('users', ['points']);
    await queryInterface.addIndex('users', ['is_verified']);

    // Create agents table
    await queryInterface.createTable('agents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
      profile_image: {
        type: Sequelize.STRING(500),
        allowNull: true
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
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addIndex('agents', ['user_id']);
    await queryInterface.addIndex('agents', ['specialization']);
    await queryInterface.addIndex('agents', ['is_verified']);
    await queryInterface.addIndex('agents', ['rating']);
    await queryInterface.addIndex('agents', ['status']);
    await queryInterface.addIndex('agents', ['in_matching_pool']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('agents');
    await queryInterface.dropTable('users');
  }
}; 