const sequelize = require('./config/database');

async function createQuizTablesProduction() {
  try {
    console.log('🔄 Creating quiz tables in production...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Create quizzes table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        max_points INTEGER NOT NULL DEFAULT 100,
        time_limit INTEGER,
        difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
        is_active BOOLEAN DEFAULT true,
        image_url VARCHAR(500),
        instructions TEXT,
        passing_score INTEGER DEFAULT 70,
        questions JSONB NOT NULL,
        scoring_rules JSONB,
        created_by UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_quizzes_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create quiz_attempts table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        quiz_id UUID NOT NULL,
        score INTEGER NOT NULL DEFAULT 0,
        max_score INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
        points_earned INTEGER NOT NULL DEFAULT 0,
        answers JSONB NOT NULL,
        time_taken INTEGER,
        completed BOOLEAN DEFAULT false,
        started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_quiz_attempts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_quiz_attempts_quiz_id FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quizzes_is_active ON quizzes(is_active)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON quizzes(difficulty)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(completed)');
    
    console.log('✅ Quiz tables created successfully in production');
    
    // Verify tables exist
    const tables = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('quizzes', 'quiz_attempts')",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('📋 Created tables:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Error creating quiz tables in production:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Only run if this script is called directly
if (require.main === module) {
  createQuizTablesProduction()
    .then(() => {
      console.log('✅ Production quiz table creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Production quiz table creation failed:', error);
      process.exit(1);
    });
}

module.exports = createQuizTablesProduction; 