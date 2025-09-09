const { User } = require('../models');
require('dotenv').config();

async function migrateAdmins() {
  try {
    console.log('🔄 Migrating existing admins...');
    
    // Get all current admins
    const admins = await User.findAll({
      where: { role: 'admin' }
    });
    
    console.log(`Found ${admins.length} existing admins to migrate`);
    
    // Update each admin with default permissions
    for (const admin of admins) {
      await admin.update({
        permissions: {
          events: ['read', 'write'],
          blogs: ['read', 'write'],
          quizzes: ['read', 'write'],
          content: ['read', 'write']
        }
      });
      console.log(`✅ Updated permissions for admin: ${admin.email}`);
    }
    
    console.log('🎉 Admin migration completed successfully');
    
  } catch (error) {
    console.error('❌ Failed to migrate admins:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  migrateAdmins()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = migrateAdmins;
