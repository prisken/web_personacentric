const createSuperAdmin = require('./createSuperAdmin');
const migrateAdmins = require('./migrateAdmins');
require('dotenv').config();

async function bootstrapSuperAdmin(mode = 'bootstrap') {
  try {
    console.log('🚀 Starting super admin system bootstrap...');
    
    // Create super admin
    await createSuperAdmin();
    
    // Migrate existing admins
    await migrateAdmins();
    
    if (mode === 'test') {
      console.log('🧪 Running in test mode...');
      // Add any test-specific setup here
    }
    
    console.log('🎉 Super admin system bootstrap completed successfully');
    
  } catch (error) {
    console.error('❌ Bootstrap failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const mode = process.argv[2] || 'bootstrap';
  bootstrapSuperAdmin(mode)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = bootstrapSuperAdmin;