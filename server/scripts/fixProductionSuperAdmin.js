const bcrypt = require('bcryptjs');
const { User } = require('../models');
require('dotenv').config();

async function fixProductionSuperAdmin() {
  try {
    console.log('🔄 Fixing super admin user in production...');
    
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
    
    await superAdmin.update({
      password_hash: hashedPassword,
      is_verified: true,
      is_system_admin: true,
      subscription_status: 'active',
      permissions: {
        users: ['read', 'write', 'delete'],
        admins: ['read', 'write', 'delete'],
        points: ['read', 'write'],
        payments: ['read', 'write', 'refund']
      }
    });
    
    console.log('✅ Super admin fixed successfully:', {
      id: superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role
    });
    
  } catch (error) {
    console.error('❌ Failed to fix super admin:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixProductionSuperAdmin()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = fixProductionSuperAdmin;
