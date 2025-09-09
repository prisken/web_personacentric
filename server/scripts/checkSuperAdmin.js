const { User } = require('../models');

async function checkSuperAdmin() {
  try {
    const superAdmin = await User.findOne({ 
      where: { 
        email: 'superadmin@personacentric.com' 
      } 
    });
    
    if (superAdmin) {
      console.log('✅ Super Admin found:');
      console.log('Email:', superAdmin.email);
      console.log('Role:', superAdmin.role);
      console.log('Is Verified:', superAdmin.is_verified);
      console.log('Is System Admin:', superAdmin.is_system_admin);
      console.log('Created At:', superAdmin.created_at);
    } else {
      console.log('❌ Super Admin not found');
    }
  } catch (error) {
    console.error('Error checking super admin:', error);
  }
}

checkSuperAdmin();
