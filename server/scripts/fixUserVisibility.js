const { User, Agent } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function fixUserVisibility() {
  try {
    console.log('🔧 Starting user visibility fix...');
    
    // Step 1: Check current database state
    console.log('\n📊 Current database state:');
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
    
    // Step 2: Check for soft-deleted users
    const softDeletedUsers = await User.findAll({
      where: {
        email: {
          [Op.like]: 'deleted_%'
        }
      }
    });
    
    console.log(`\n🗑️  Soft-deleted users found: ${softDeletedUsers.length}`);
    softDeletedUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    
    // Step 3: Check for users with deleted permissions
    const usersWithDeletedPermissions = await User.findAll({
      where: {
        permissions: {
          [Op.contains]: { deleted: true }
        }
      }
    });
    
    console.log(`\n🚫 Users with deleted permissions: ${usersWithDeletedPermissions.length}`);
    usersWithDeletedPermissions.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    
    // Step 4: Create missing users if needed
    const expectedUsers = [
      // Super Admin
      {
        email: 'superadmin@personacentric.com',
        password: 'superadmin123',
        first_name: 'Super',
        last_name: 'Admin',
        phone: '+852-0000-0000',
        role: 'super_admin',
        points: 0,
        permissions: { super_admin: true }
      },
      // Admin
      {
        email: 'admin@personacentric.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        phone: '+852-1234-5678',
        role: 'admin',
        points: 0
      },
      // Agents
      {
        email: 'agent1@personacentric.com',
        password: 'agent123',
        first_name: '張',
        last_name: '顧問',
        phone: '+852-2345-6789',
        role: 'agent',
        points: 0
      },
      {
        email: 'agent2@personacentric.com',
        password: 'agent123',
        first_name: '李',
        last_name: '顧問',
        phone: '+852-3456-7890',
        role: 'agent',
        points: 0
      },
      {
        email: 'sarah.johnson@personacentric.com',
        password: 'agent123',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '+852-4567-8901',
        role: 'agent',
        points: 1805
      },
      {
        email: 'michael.chen@personacentric.com',
        password: 'agent123',
        first_name: 'Michael',
        last_name: 'Chen',
        phone: '+852-5678-9012',
        role: 'agent',
        points: 0
      },
      {
        email: 'emily.rodriguez@personacentric.com',
        password: 'agent123',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        phone: '+852-6789-0123',
        role: 'agent',
        points: 0
      },
      {
        email: 'kenji.tanaka@personacentric.com',
        password: 'agent123',
        first_name: 'Kenji',
        last_name: 'Tanaka',
        phone: '+852-7890-1234',
        role: 'agent',
        points: 0
      },
      {
        email: 'lucy.wong@personacentric.com',
        password: 'agent123',
        first_name: 'Lucy',
        last_name: 'Wong',
        phone: '+852-8901-2345',
        role: 'agent',
        points: 0
      },
      {
        email: 'alexander.smith@personacentric.com',
        password: 'agent123',
        first_name: 'Alexander',
        last_name: 'Smith',
        phone: '+852-9012-3456',
        role: 'agent',
        points: 0
      },
      {
        email: 'mei.lin@personacentric.com',
        password: 'agent123',
        first_name: 'Mei',
        last_name: 'Lin',
        phone: '+852-0123-4567',
        role: 'agent',
        points: 0
      },
      // Clients
      {
        email: 'client1@personacentric.com',
        password: 'client123',
        first_name: '王',
        last_name: '客戶',
        phone: '+852-9876-5432',
        role: 'client',
        points: 555
      },
      {
        email: 'client2@personacentric.com',
        password: 'client123',
        first_name: '陳',
        last_name: '客戶',
        phone: '+852-8765-4321',
        role: 'client',
        points: 10
      },
      {
        email: 'client1@test.com',
        password: 'client123',
        first_name: '王',
        last_name: '小明',
        phone: '+852-7654-3210',
        role: 'client',
        points: 0
      },
      {
        email: 'client2@test.com',
        password: 'client123',
        first_name: '陳',
        last_name: '美玲',
        phone: '+852-6543-2109',
        role: 'client',
        points: 0
      },
      {
        email: 'client3@test.com',
        password: 'client123',
        first_name: 'John',
        last_name: 'Smith',
        phone: '+852-5432-1098',
        role: 'client',
        points: 0
      }
    ];
    
    console.log('\n🔍 Checking for missing users...');
    let createdCount = 0;
    
    for (const userData of expectedUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (!existingUser) {
        try {
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const user = await User.create({
            id: uuidv4(),
            email: userData.email,
            password_hash: hashedPassword,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            role: userData.role,
            language_preference: 'zh-TW',
            points: userData.points,
            subscription_status: 'active',
            is_verified: true,
            permissions: userData.permissions || {}
          });
          
          console.log(`✅ Created missing user: ${userData.first_name} ${userData.last_name} (${userData.email})`);
          createdCount++;
        } catch (error) {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      } else {
        console.log(`⏭️  User ${userData.email} already exists`);
      }
    }
    
    // Step 5: Clean up any users with deleted permissions
    console.log('\n🧹 Cleaning up users with deleted permissions...');
    let cleanedCount = 0;
    
    for (const user of usersWithDeletedPermissions) {
      try {
        // Remove the deleted flag from permissions
        const permissions = user.permissions || {};
        delete permissions.deleted;
        delete permissions.deleted_at;
        delete permissions.deleted_by;
        delete permissions.deletion_reason;
        
        await user.update({
          permissions: permissions,
          is_verified: true,
          subscription_status: 'active'
        });
        
        console.log(`✅ Cleaned up user: ${user.email}`);
        cleanedCount++;
      } catch (error) {
        console.error(`❌ Error cleaning up user ${user.email}:`, error.message);
      }
    }
    
    // Step 6: Final verification
    console.log('\n📊 Final database state:');
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
    
    console.log('\n🎉 User visibility fix completed!');
    console.log(`📊 Summary: ${createdCount} users created, ${cleanedCount} users cleaned up`);
    
    return {
      success: true,
      created: createdCount,
      cleaned: cleanedCount,
      total: finalUsers.length,
      byRole: finalUsersByRole
    };
    
  } catch (error) {
    console.error('❌ Error fixing user visibility:', error);
    throw error;
  }
}

module.exports = fixUserVisibility;

// Run if called directly
if (require.main === module) {
  fixUserVisibility()
    .then((result) => {
      console.log('✅ User visibility fix completed successfully');
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to fix user visibility:', error);
      process.exit(1);
    });
}
