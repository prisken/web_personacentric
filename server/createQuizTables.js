const sequelize = require('./config/database');

async function createQuizTables() {
  try {
    console.log('🔄 Creating quiz tables...');
    
    // Create quizzes table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        max_points INTEGER NOT NULL DEFAULT 100,
        time_limit INTEGER,
        difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
        is_active BOOLEAN DEFAULT 1,
        image_url VARCHAR(500),
        instructions TEXT,
        passing_score INTEGER DEFAULT 70,
        questions JSON NOT NULL,
        scoring_rules JSON,
        created_by UUID NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
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
        answers JSON NOT NULL,
        time_taken INTEGER,
        completed BOOLEAN DEFAULT 0,
        started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quizzes_is_active ON quizzes(is_active)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON quizzes(difficulty)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(completed)');
    
    console.log('✅ Quiz tables created successfully');
    
    // Verify tables exist
    const tables = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('quizzes', 'quiz_attempts')",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('📋 Created tables:', tables.map(t => t.name));
    
  } catch (error) {
    console.error('❌ Error creating quiz tables:', error);
  } finally {
    await sequelize.close();
  }
}

createQuizTables(); 