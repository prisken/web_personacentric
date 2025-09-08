const { User } = require('../models');
const { USER_ROLES } = require('../utils/constants');

/**
 * Migrate Existing Admins Script
 * Migrates existing admin users to the new role system
 */
async function migrateAdmins() {
  try {
    console.log('🔄 Migrating existing admin users...');
    
    // Get all current admin users
    const admins = await User.findAll({ 
      where: { role: USER_ROLES.ADMIN } 
    });
    
    console.log(`📋 Found ${admins.length} existing admin users`);
    
    if (admins.length === 0) {
      console.log('✅ No existing admins to migrate');
      return;
    }
    
    // Log existing admins
    console.log('\n📝 Existing Admin Users:');
    for (const admin of admins) {
      console.log(`  - ${admin.email} (${admin.first_name} ${admin.last_name})`);
    }
    
    // Note: We don't actually change their role since they should remain as regular admins
    // The new system will automatically restrict their permissions based on the new role structure
    
    console.log('\n✅ Admin migration completed successfully!');
    console.log('📋 Summary:');
    console.log(`  - ${admins.length} admin users remain as regular admins`);
    console.log('  - They will have access to content management (events, blogs, quizzes)');
    console.log('  - They will NOT have access to user management, points, or payments');
    console.log('  - Only super admins can manage users, points, and payments');
    
    return admins;
    
  } catch (error) {
    console.error('❌ Failed to migrate admins:', error.message);
    throw error;
  }
}

/**
 * Show current admin status
 */
async function showAdminStatus() {
  try {
    console.log('📊 Current Admin Status:');
    
    // Get all users by role
    const superAdmins = await User.findAll({ 
      where: { role: USER_ROLES.SUPER_ADMIN } 
    });
    
    const admins = await User.findAll({ 
      where: { role: USER_ROLES.ADMIN } 
    });
    
    const agents = await User.findAll({ 
      where: { role: USER_ROLES.AGENT } 
    });
    
    const clients = await User.findAll({ 
      where: { role: USER_ROLES.CLIENT } 
    });
    
    console.log(`\n👑 Super Admins: ${superAdmins.length}`);
    for (const user of superAdmins) {
      console.log(`  - ${user.email} (${user.first_name} ${user.last_name})`);
    }
    
    console.log(`\n👑 Admins: ${admins.length}`);
    for (const user of admins) {
      console.log(`  - ${user.email} (${user.first_name} ${user.last_name})`);
    }
    
    console.log(`\n👨‍💼 Agents: ${agents.length}`);
    console.log(`\n👤 Clients: ${clients.length}`);
    
    console.log('\n📋 Role Permissions Summary:');
    console.log('  Super Admin: Full system access (users, points, payments, content)');
    console.log('  Admin: Content management only (events, blogs, quizzes)');
    console.log('  Agent: Event management and client relationships');
    console.log('  Client: Basic access (view content, participate in events)');
    
  } catch (error) {
    console.error('❌ Failed to show admin status:', error.message);
    throw error;
  }
}

// CLI interface
async function main() {
  const command = process.argv[2] || 'migrate';
  
  try {
    switch (command) {
      case 'migrate':
        await migrateAdmins();
        break;
      case 'status':
        await showAdminStatus();
        break;
      default:
        console.log('Usage: node migrateAdmins.js [migrate|status]');
        console.log('  migrate - Migrate existing admin users');
        console.log('  status  - Show current admin status');
        process.exit(1);
    }
    
    console.log('✅ Admin migration process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Admin migration process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { migrateAdmins, showAdminStatus };
