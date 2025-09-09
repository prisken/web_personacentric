#!/usr/bin/env node

/**
 * Production Database Schema Fix Script
 * This script adds missing columns to the production database
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DB_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

async function fixProductionDatabase() {
  try {
    console.log('🔄 Connecting to production database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    console.log('🔄 Adding missing columns to users table...');

    // Add permissions column
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '{}';
      `);
      console.log('✅ Added permissions column');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('duplicate column')) {
        console.log('✅ Permissions column already exists');
      } else {
        console.error('❌ Error adding permissions column:', error.message);
      }
    }

    // Add created_by_super_admin column
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN created_by_super_admin UUID REFERENCES users(id);
      `);
      console.log('✅ Added created_by_super_admin column');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('duplicate column')) {
        console.log('✅ created_by_super_admin column already exists');
      } else {
        console.error('❌ Error adding created_by_super_admin column:', error.message);
      }
    }

    // Add is_system_admin column
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN is_system_admin BOOLEAN DEFAULT FALSE;
      `);
      console.log('✅ Added is_system_admin column');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('duplicate column')) {
        console.log('✅ is_system_admin column already exists');
      } else {
        console.error('❌ Error adding is_system_admin column:', error.message);
      }
    }

    // Add super_admin to role enum if it doesn't exist
    try {
      await sequelize.query(`
        ALTER TYPE enum_users_role ADD VALUE IF NOT EXISTS 'super_admin';
      `);
      console.log('✅ Added super_admin to role enum');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ super_admin role already exists in enum');
      } else {
        console.error('❌ Error adding super_admin role:', error.message);
      }
    }

    console.log('🎉 Production database schema fix completed successfully!');

  } catch (error) {
    console.error('💥 Failed to fix production database:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the fix
fixProductionDatabase();
