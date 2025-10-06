const sequelize = require('./server/config/database');
const FoodForTalkUser = require('./server/models/FoodForTalkUser');

async function listUsers() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
    
    const users = await FoodForTalkUser.findAll({
      attributes: ['email', 'nickname', 'secret_passkey', 'is_verified', 'is_active'],
      limit: 10
    });
    
    console.log('Food for Talk Users in database:');
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach(user => {
        console.log({
          email: user.email,
          nickname: user.nickname,
          hasPasskey: !!user.secret_passkey,
          passkey: user.secret_passkey,
          isVerified: user.is_verified,
          isActive: user.is_active
        });
      });
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

listUsers();
