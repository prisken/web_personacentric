const bcrypt = require('bcryptjs');
const { User } = require('../models');
require('dotenv').config();

async function createProductionSuperAdmin() {
  try {
    console.log('🔄 Creating super admin user in production...');
    
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      where: { role: 'super_admin' }
    });
    
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists:', existingSuperAdmin.email);
      return;
    }
    
    // Create super admin user
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const superAdmin = await User.create({
      email: 'superadmin@personacentric.com',
      password_hash: hashedPassword,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'super_admin',
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
    
    console.log('✅ Super admin created successfully:', {
      id: superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role
    });
    
  } catch (error) {
    console.error('❌ Failed to create super admin:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createProductionSuperAdmin()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = createProductionSuperAdmin;
