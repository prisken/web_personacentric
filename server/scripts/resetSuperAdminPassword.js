const bcrypt = require('bcryptjs');
const { User } = require('../models');
require('dotenv').config();

async function resetSuperAdminPassword() {
  try {
    console.log('🔄 Resetting super admin password...');
    
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
    
    await User.update(
      { password_hash: hashedPassword },
      { where: { role: 'super_admin' } }
    );
    
    console.log('✅ Super admin password reset successfully:', {
      id: superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role
    });
    
  } catch (error) {
    console.error('❌ Failed to reset super admin password:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  resetSuperAdminPassword()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = resetSuperAdminPassword;
