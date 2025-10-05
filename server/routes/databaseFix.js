const express = require('express');
const { Sequelize } = require('sequelize');
const router = express.Router();

// Database fix endpoint - should only be accessible in production
router.post('/fix-food-for-talk', async (req, res) => {
  try {
    // Only allow this in production environment
    if (process.env.NODE_ENV !== 'production') {
      return res.status(403).json({ 
        success: false, 
        error: 'This endpoint is only available in production' 
      });
    }

    console.log('🔧 Starting Food for Talk database fix...');
    
    // Use the same database connection as the main app
    const sequelize = require('../config/database');
    const queryInterface = sequelize.getQueryInterface();

    // Check if food_for_talk_users table exists
    const tables = await queryInterface.showAllTables();
    console.log('📋 Existing tables:', tables);
    
    if (!tables.includes('food_for_talk_users')) {
      console.log('❌ food_for_talk_users table does not exist. Creating...');
      
      // Create the main table
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
          allowNull: true,
          defaultValue: 'Anonymous'
        },
        last_name: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: 'Participant'
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        whatsapp_phone: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        age: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        occupation: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        bio: {
          type: Sequelize.TEXT,
          allowNull: true
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
          allowNull: true
        },
        emergency_contact_phone: {
          type: Sequelize.STRING(20),
          allowNull: true
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

      console.log('✅ Created food_for_talk_users table');
    }

    // Check existing columns
    const tableDescription = await queryInterface.describeTable('food_for_talk_users');
    const existingColumns = Object.keys(tableDescription);
    console.log('📋 Existing columns:', existingColumns);

    // Add missing expanded registration fields
    const expandedFields = [
      { name: 'nickname', type: Sequelize.STRING(100) },
      { name: 'gender', type: Sequelize.STRING(50) },
      { name: 'expect_person_type', type: Sequelize.STRING(255) },
      { name: 'dream_first_date', type: Sequelize.STRING(255) },
      { name: 'dream_first_date_other', type: Sequelize.STRING(255) },
      { name: 'interests_other', type: Sequelize.STRING(255) },
      { name: 'attractive_traits', type: Sequelize.JSONB, defaultValue: [] },
      { name: 'attractive_traits_other', type: Sequelize.STRING(255) },
      { name: 'japanese_food_preference', type: Sequelize.STRING(255) },
      { name: 'quickfire_magic_item_choice', type: Sequelize.STRING(255) },
      { name: 'quickfire_desired_outcome', type: Sequelize.STRING(255) },
      { name: 'consent_accepted', type: Sequelize.BOOLEAN, defaultValue: false }
    ];

    let addedColumns = 0;
    for (const field of expandedFields) {
      if (!existingColumns.includes(field.name)) {
        console.log(`➕ Adding column: ${field.name}`);
        const columnDef = { 
          type: field.type, 
          allowNull: true 
        };
        if (field.defaultValue !== undefined) {
          columnDef.defaultValue = field.defaultValue;
        }
        await queryInterface.addColumn('food_for_talk_users', field.name, columnDef);
        addedColumns++;
      } else {
        console.log(`✅ Column already exists: ${field.name}`);
      }
    }

    // Add whatsapp_phone if missing
    if (!existingColumns.includes('whatsapp_phone')) {
      console.log('➕ Adding column: whatsapp_phone');
      await queryInterface.addColumn('food_for_talk_users', 'whatsapp_phone', {
        type: Sequelize.STRING(20),
        allowNull: true
      });
      addedColumns++;
    }

    // Create chat messages table if missing
    if (!tables.includes('food_for_talk_chat_messages')) {
      console.log('➕ Creating food_for_talk_chat_messages table...');
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
      console.log('✅ Created food_for_talk_chat_messages table');
    }

    // Create profile views table if missing
    if (!tables.includes('food_for_talk_profile_views')) {
      console.log('➕ Creating food_for_talk_profile_views table...');
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
      console.log('✅ Created food_for_talk_profile_views table');
    }

    // Check final schema
    const finalSchema = await queryInterface.describeTable('food_for_talk_users');
    const finalColumns = Object.keys(finalSchema);

    console.log('🎉 Database fix completed successfully!');
    console.log(`📊 Added ${addedColumns} new columns to food_for_talk_users table`);

    res.json({
      success: true,
      message: 'Database fix completed successfully',
      addedColumns: addedColumns,
      totalColumns: finalColumns.length,
      columns: finalColumns
    });

  } catch (error) {
    console.error('❌ Database fix failed:', error);
    res.status(500).json({
      success: false,
      error: 'Database fix failed',
      details: error.message
    });
  }
});

module.exports = router;
