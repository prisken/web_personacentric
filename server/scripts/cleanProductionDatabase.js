const { User, Agent } = require('../models');
const { Op } = require('sequelize');

async function cleanProductionDatabase() {
  try {
    console.log('🧹 Starting production database cleanup...');
    
    // Step 1: Get current state
    console.log('\n📊 Current production database state:');
    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'created_at'],
      order: [['role', 'ASC'], ['first_name', 'ASC']]
    });
    
    console.log(`Total users in database: ${allUsers.length}`);
    
    const usersByRole = {};
    allUsers.forEach(user => {
      if (!usersByRole[user.role]) {
        usersByRole[user.role] = [];
      }
      usersByRole[user.role].push(user);
    });
    
    Object.keys(usersByRole).forEach(role => {
      console.log(`  ${role}: ${usersByRole[role].length} users`);
    });
    
    // Step 2: Identify users that should be kept (based on production reality)
    const usersToKeep = [
      'superadmin@personacentric.com',
      'admin@personacentric.com',
      'agent1@personacentric.com',
      'agent2@personacentric.com',
      'sarah.johnson@personacentric.com',
      'client1@personacentric.com',
      'client2@personacentric.com'
    ];
    
    console.log('\n✅ Users to keep (production reality):');
    usersToKeep.forEach(email => {
      const user = allUsers.find(u => u.email === email);
      if (user) {
        console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`);
      } else {
        console.log(`  - MISSING: ${email}`);
      }
    });
    
    // Step 3: Identify users to remove
    const usersToRemove = allUsers.filter(user => !usersToKeep.includes(user.email));
    
    console.log(`\n🗑️  Users to remove: ${usersToRemove.length}`);
    usersToRemove.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`);
    });
    
    // Step 4: Remove extra users (soft delete approach)
    let removedCount = 0;
    for (const user of usersToRemove) {
      try {
        // Soft delete by changing email to deleted_ prefix
        const deletedEmail = `deleted_${Date.now()}_${user.email}`;
        await user.update({
          email: deletedEmail,
          first_name: 'Deleted',
          last_name: 'User',
          phone: null,
          is_verified: false,
          subscription_status: 'inactive',
          permissions: { 
            deleted: true, 
            deleted_at: new Date().toISOString(),
            original_email: user.email,
            original_name: `${user.first_name} ${user.last_name}`
          }
        });
        
        console.log(`✅ Soft deleted: ${user.email} -> ${deletedEmail}`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Error removing user ${user.email}:`, error.message);
      }
    }
    
    // Step 5: Verify final state
    console.log('\n📊 Final production database state:');
    const finalUsers = await User.findAll({
      where: {
        email: {
          [Op.notLike]: 'deleted_%'
        }
      },
      attributes: ['id', 'email', 'first_name', 'last_name', 'role'],
      order: [['role', 'ASC'], ['first_name', 'ASC']]
    });
    
    console.log(`Total active users: ${finalUsers.length}`);
    
    const finalUsersByRole = {};
    finalUsers.forEach(user => {
      if (!finalUsersByRole[user.role]) {
        finalUsersByRole[user.role] = [];
      }
      finalUsersByRole[user.role].push(user);
    });
    
    Object.keys(finalUsersByRole).forEach(role => {
      console.log(`  ${role}: ${finalUsersByRole[role].length} users`);
    });
    
    console.log('\n🎉 Production database cleanup completed!');
    console.log(`📊 Summary: ${removedCount} users removed, ${finalUsers.length} users remaining`);
    
    return {
      success: true,
      removed: removedCount,
      remaining: finalUsers.length,
      byRole: finalUsersByRole
    };
    
  } catch (error) {
    console.error('❌ Error cleaning production database:', error);
    throw error;
  }
}

module.exports = cleanProductionDatabase;

// Run if called directly
if (require.main === module) {
  cleanProductionDatabase()
    .then((result) => {
      console.log('✅ Production database cleanup completed successfully');
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to clean production database:', error);
      process.exit(1);
    });
}
