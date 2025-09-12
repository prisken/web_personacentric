// Railway Console Script to check production database users
// Run this script in Railway's console to check production users

const { User } = require('./models');
const { Op } = require('sequelize');

async function checkProductionUsers() {
  try {
    console.log('🔍 Checking Production Database Users...');
    
    // Get all users
    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'created_at'],
      order: [['role', 'ASC'], ['first_name', 'ASC']]
    });
    
    console.log(`\n📊 Total users in production: ${allUsers.length}`);
    
    // Group by role
    const usersByRole = {};
    allUsers.forEach(user => {
      if (!usersByRole[user.role]) {
        usersByRole[user.role] = [];
      }
      usersByRole[user.role].push(user);
    });
    
    console.log('\n📋 Users by role:');
    Object.keys(usersByRole).forEach(role => {
      console.log(`  ${role}: ${usersByRole[role].length} users`);
    });
    
    console.log('\n👥 All users in production:');
    allUsers.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`);
    });
    
    // Check for soft-deleted users
    const deletedUsers = await User.findAll({
      where: {
        email: {
          [Op.like]: 'deleted_%'
        }
      },
      attributes: ['id', 'email', 'first_name', 'last_name', 'role']
    });
    
    console.log(`\n🗑️  Soft-deleted users: ${deletedUsers.length}`);
    if (deletedUsers.length > 0) {
      deletedUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    }
    
    // Get active users only
    const activeUsers = await User.findAll({
      where: {
        email: {
          [Op.notLike]: 'deleted_%'
        }
      },
      attributes: ['id', 'email', 'first_name', 'last_name', 'role'],
      order: [['role', 'ASC'], ['first_name', 'ASC']]
    });
    
    console.log(`\n✅ Active users (not soft-deleted): ${activeUsers.length}`);
    
    const activeUsersByRole = {};
    activeUsers.forEach(user => {
      if (!activeUsersByRole[user.role]) {
        activeUsersByRole[user.role] = [];
      }
      activeUsersByRole[user.role].push(user);
    });
    
    Object.keys(activeUsersByRole).forEach(role => {
      console.log(`  ${role}: ${activeUsersByRole[role].length} users`);
    });
    
    console.log('\n📈 SUMMARY:');
    console.log(`Total users in database: ${allUsers.length}`);
    console.log(`Active users: ${activeUsers.length}`);
    console.log(`Soft-deleted users: ${deletedUsers.length}`);
    
  } catch (error) {
    console.error('❌ Error checking production database:', error);
    throw error;
  }
}

// Export for use in Railway console
module.exports = checkProductionUsers;

// Run if called directly
if (require.main === module) {
  checkProductionUsers()
    .then(() => {
      console.log('✅ Production database check completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to check production database:', error);
      process.exit(1);
    });
}
