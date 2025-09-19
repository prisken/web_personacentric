'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create food_for_talk_users table
    await queryInterface.createTable('food_for_talk_users', {
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
      age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      occupation: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      interests: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      dietary_restrictions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      emergency_contact_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      emergency_contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      profile_photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      secret_passkey: {
        type: Sequelize.STRING(255),
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
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      registration_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create food_for_talk_chat_messages table
    await queryInterface.createTable('food_for_talk_chat_messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'food_for_talk_users',
          key: 'id'
        }
      },
      recipient_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'food_for_talk_users',
          key: 'id'
        }
      },
      message_type: {
        type: Sequelize.ENUM('public', 'private', 'system'),
        allowNull: false,
        defaultValue: 'public'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      conversation_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create food_for_talk_profile_views table
    await queryInterface.createTable('food_for_talk_profile_views', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      viewer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'food_for_talk_users',
          key: 'id'
        }
      },
      viewed_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'food_for_talk_users',
          key: 'id'
        }
      },
      viewed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('food_for_talk_users', ['email']);
    await queryInterface.addIndex('food_for_talk_users', ['is_verified']);
    await queryInterface.addIndex('food_for_talk_users', ['is_active']);
    await queryInterface.addIndex('food_for_talk_users', ['registration_date']);
    await queryInterface.addIndex('food_for_talk_users', ['secret_passkey']);

    await queryInterface.addIndex('food_for_talk_chat_messages', ['sender_id']);
    await queryInterface.addIndex('food_for_talk_chat_messages', ['recipient_id']);
    await queryInterface.addIndex('food_for_talk_chat_messages', ['message_type']);
    await queryInterface.addIndex('food_for_talk_chat_messages', ['conversation_id']);
    await queryInterface.addIndex('food_for_talk_chat_messages', ['created_at']);

    await queryInterface.addIndex('food_for_talk_profile_views', ['viewer_id']);
    await queryInterface.addIndex('food_for_talk_profile_views', ['viewed_user_id']);
    await queryInterface.addIndex('food_for_talk_profile_views', ['viewed_at']);
    await queryInterface.addIndex('food_for_talk_profile_views', ['viewer_id', 'viewed_user_id'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('food_for_talk_profile_views');
    await queryInterface.dropTable('food_for_talk_chat_messages');
    await queryInterface.dropTable('food_for_talk_users');
  }
};
