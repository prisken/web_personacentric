const bcrypt = require('bcrypt');
const { User } = require('../models');

async function createSuperAdmin() {
  try {
    console.log('🔄 Creating super admin user...');
    
    const existingSuperAdmin = await User.findOne({ 
      where: { email: 'superadmin@personacentric.com' } 
    });
    
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists');
      return existingSuperAdmin;
    }
    
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const superAdmin = await User.create({
      email: 'superadmin@personacentric.com',
      password_hash: hashedPassword,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'super_admin',
      is_verified: true,
      is_system_admin: true,
      permissions: {
        user_management: true,
        point_management: true,
        payment_management: true,
        admin_management: true,
        system_config: true
      }
    });
    
    console.log('✅ Super admin created successfully:', superAdmin.email);
    console.log('📧 Email: superadmin@personacentric.com');
    console.log('🔑 Password: superadmin123');
    console.log('⚠️  Please change the password after first login!');
    
    return superAdmin;
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createSuperAdmin()
    .then(() => {
      console.log('🎉 Super admin creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Super admin creation failed:', error);
      process.exit(1);
    });
}

module.exports = createSuperAdmin;