const MigrationRunner = require('../utils/runMigrations');
const EnumManager = require('../utils/enumManager');
const createSuperAdmin = require('./createSuperAdmin');
const { migrateAdmins, showAdminStatus } = require('./migrateAdmins');

/**
 * Bootstrap Super Admin System
 * Complete setup script for the super admin role system
 */
async function bootstrapSuperAdmin() {
  try {
    console.log('🚀 Starting Super Admin System Bootstrap...');
    console.log('==========================================');
    
    // Step 1: Run database migrations
    console.log('\n📦 Step 1: Running Database Migrations');
    console.log('--------------------------------------');
    const migrationRunner = new MigrationRunner();
    await migrationRunner.runMigrations();
    await migrationRunner.close();
    
    // Step 2: Verify enum management
    console.log('\n🔧 Step 2: Verifying Enum Management');
    console.log('-----------------------------------');
    const enumManager = new EnumManager();
    await enumManager.getEnumInfo('enum_users_role');
    await enumManager.close();
    
    // Step 3: Create super admin user
    console.log('\n👑 Step 3: Creating Super Admin User');
    console.log('-----------------------------------');
    const superAdmin = await createSuperAdmin();
    
    // Step 4: Migrate existing admins
    console.log('\n🔄 Step 4: Migrating Existing Admins');
    console.log('-----------------------------------');
    await migrateAdmins();
    
    // Step 5: Show final status
    console.log('\n📊 Step 5: Final System Status');
    console.log('-----------------------------');
    await showAdminStatus();
    
    console.log('\n🎉 Super Admin System Bootstrap Completed Successfully!');
    console.log('=====================================================');
    console.log('\n📋 Next Steps:');
    console.log('1. Test the super admin login');
    console.log('2. Verify admin users can still access content management');
    console.log('3. Test that regular admins cannot access user/point/payment management');
    console.log('4. Implement the frontend super admin dashboard');
    console.log('5. Update existing admin routes to use new permission system');
    
    return superAdmin;
    
  } catch (error) {
    console.error('\n💥 Super Admin System Bootstrap Failed!');
    console.error('=====================================');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check database connection');
    console.error('2. Verify all migration files are present');
    console.error('3. Check database permissions');
    console.error('4. Review error logs above');
    throw error;
  }
}

/**
 * Test the super admin system
 */
async function testSuperAdminSystem() {
  try {
    console.log('🧪 Testing Super Admin System...');
    console.log('================================');
    
    // Test 1: Check if super admin exists
    console.log('\n🔍 Test 1: Super Admin User Check');
    const { User } = require('../models');
    const { USER_ROLES } = require('../utils/constants');
    
    const superAdmin = await User.findOne({ 
      where: { 
        role: USER_ROLES.SUPER_ADMIN,
        is_system_admin: true
      } 
    });
    
    if (superAdmin) {
      console.log('✅ Super admin user exists:', superAdmin.email);
    } else {
      console.log('❌ Super admin user not found');
      return false;
    }
    
    // Test 2: Check enum values (SQLite doesn't use enums)
    console.log('\n🔍 Test 2: Role Enum Check');
    const enumManager = new EnumManager();
    const enumInfo = await enumManager.getEnumInfo('enum_users_role');
    await enumManager.close();
    
    if (enumInfo === null) {
      console.log('✅ SQLite detected - enum check not applicable');
    } else if (enumInfo && enumInfo.values.includes('super_admin')) {
      console.log('✅ Super admin role exists in enum');
    } else {
      console.log('❌ Super admin role not found in enum');
      return false;
    }
    
    // Test 3: Check database fields
    console.log('\n🔍 Test 3: Database Fields Check');
    const userFields = Object.keys(superAdmin.dataValues);
    const requiredFields = ['permissions', 'created_by_super_admin', 'is_system_admin'];
    
    for (const field of requiredFields) {
      if (userFields.includes(field)) {
        console.log(`✅ Field '${field}' exists`);
      } else {
        console.log(`❌ Field '${field}' missing`);
        return false;
      }
    }
    
    // Test 4: Check permissions
    console.log('\n🔍 Test 4: Permissions Check');
    if (superAdmin.permissions && Object.keys(superAdmin.permissions).length > 0) {
      console.log('✅ Super admin has permissions configured');
      console.log(`   Permissions count: ${Object.keys(superAdmin.permissions).length}`);
    } else {
      console.log('❌ Super admin has no permissions configured');
      return false;
    }
    
    console.log('\n🎉 All tests passed! Super admin system is ready.');
    return true;
    
  } catch (error) {
    console.error('❌ Super admin system test failed:', error.message);
    return false;
  }
}

// CLI interface
async function main() {
  const command = process.argv[2] || 'bootstrap';
  
  try {
    switch (command) {
      case 'bootstrap':
        await bootstrapSuperAdmin();
        break;
      case 'test':
        const success = await testSuperAdminSystem();
        process.exit(success ? 0 : 1);
        break;
      default:
        console.log('Usage: node bootstrapSuperAdmin.js [bootstrap|test]');
        console.log('  bootstrap - Complete super admin system setup');
        console.log('  test      - Test the super admin system');
        process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Bootstrap process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { bootstrapSuperAdmin, testSuperAdminSystem };
