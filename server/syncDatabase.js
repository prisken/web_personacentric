const sequelize = require('./config/database');
const { Quiz, QuizAttempt } = require('./models');

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database...');
    
    // Force sync to create tables (this will drop existing tables in development)
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Database synced successfully');
    
    // Check if quiz tables exist
    const quizTableExists = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='quizzes'",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (quizTableExists.length > 0) {
      console.log('✅ Quiz tables exist');
    } else {
      console.log('❌ Quiz tables do not exist');
    }
    
  } catch (error) {
    console.error('❌ Database sync error:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase(); 