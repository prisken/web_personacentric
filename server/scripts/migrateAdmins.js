const { User } = require('../models');

async function migrateAdmins() {
  try {
    console.log('🔄 Migrating existing admins...');
    
    // Get all current admins
    const admins = await User.findAll({ 
      where: { role: 'admin' } 
    });
    
    console.log(`📊 Found ${admins.length} existing admins to migrate`);
    
    if (admins.length === 0) {
      console.log('✅ No existing admins found - migration not needed');
      return;
    }
    
    // Log existing admins
    admins.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.first_name} ${admin.last_name})`);
    });
    
    // Keep them as regular admins (no role change needed)
    // They will automatically have reduced permissions according to the new system
    console.log('✅ Admin migration completed');
    console.log('ℹ️  Existing admins will have reduced permissions (content management only)');
    console.log('ℹ️  Super admin access required for user management, points, payments, etc.');
    
  } catch (error) {
    console.error('❌ Error migrating admins:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  migrateAdmins()
    .then(() => {
      console.log('🎉 Admin migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateAdmins;