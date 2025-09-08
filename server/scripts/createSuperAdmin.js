const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { USER_ROLES, DEFAULT_SUPER_ADMIN_PERMISSIONS } = require('../utils/constants');

/**
 * Create Super Admin User Script
 * Creates the initial super admin user for the system
 */
async function createSuperAdmin() {
  try {
    console.log('🚀 Creating Super Admin user...');
    
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ 
      where: { 
        role: USER_ROLES.SUPER_ADMIN,
        is_system_admin: true
      } 
    });
    
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists:', existingSuperAdmin.email);
      return existingSuperAdmin;
    }
    
    // Get super admin credentials from environment or use defaults
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@personacentric.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'superadmin123';
    const firstName = process.env.SUPER_ADMIN_FIRST_NAME || 'Super';
    const lastName = process.env.SUPER_ADMIN_LAST_NAME || 'Admin';
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('⚠️  User with this email already exists, updating to super admin...');
      
      // Update existing user to super admin
      await existingUser.update({
        role: USER_ROLES.SUPER_ADMIN,
        is_system_admin: true,
        permissions: DEFAULT_SUPER_ADMIN_PERMISSIONS,
        is_verified: true
      });
      
      console.log('✅ Existing user updated to super admin:', email);
      return existingUser;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create super admin user
    const superAdmin = await User.create({
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: USER_ROLES.SUPER_ADMIN,
      is_system_admin: true,
      permissions: DEFAULT_SUPER_ADMIN_PERMISSIONS,
      is_verified: true,
      subscription_status: 'active'
    });
    
    console.log('🎉 Super admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👑 Role:', superAdmin.role);
    console.log('🆔 ID:', superAdmin.id);
    
    return superAdmin;
    
  } catch (error) {
    console.error('❌ Failed to create super admin:', error.message);
    throw error;
  }
}

// CLI interface
async function main() {
  try {
    await createSuperAdmin();
    console.log('✅ Super admin setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Super admin setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = createSuperAdmin;
