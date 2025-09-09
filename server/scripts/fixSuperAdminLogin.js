const bcrypt = require('bcryptjs');
const { User } = require('../models');
require('dotenv').config();

async function fixSuperAdminLogin() {
  try {
    console.log('🔄 Fixing super admin login...');
    
    // Find super admin
    const superAdmin = await User.findOne({
      where: { role: 'super_admin' }
    });
    
    if (!superAdmin) {
      console.log('❌ Super admin not found');
      return;
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    // Update user with raw query
    const sequelize = require('../config/database');
    await sequelize.query(`
      UPDATE users
      SET password_hash = :password,
          is_verified = true,
          is_system_admin = true,
          subscription_status = 'active',
          permissions = :permissions
      WHERE role = 'super_admin';
    `, {
      replacements: {
        password: hashedPassword,
        permissions: JSON.stringify({
          users: ['read', 'write', 'delete'],
          admins: ['read', 'write', 'delete'],
          points: ['read', 'write'],
          payments: ['read', 'write', 'refund']
        })
      }
    });
    
    console.log('✅ Super admin login fixed successfully:', {
      id: superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role
    });
    
  } catch (error) {
    console.error('❌ Failed to fix super admin login:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixSuperAdminLogin()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = fixSuperAdminLogin;
