const { sequelize } = require('./config/database');

async function fixQuizColumns() {
  try {
    console.log('🔧 Fixing quiz columns in production database...');
    
    // Add missing columns to quizzes table
    const quizColumns = [
      'ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "external_quiz_url" VARCHAR(500);',
      'ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "quiz_type" VARCHAR(20) DEFAULT \'internal\';',
      'ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "external_quiz_id" VARCHAR(100);',
      'ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "point_calculation_method" VARCHAR(20) DEFAULT \'percentage\';',
      'ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "min_score_for_points" INTEGER DEFAULT 70;'
    ];
    
    for (const query of quizColumns) {
      try {
        await sequelize.query(query);
        console.log('✅ Executed:', query.substring(0, 50) + '...');
      } catch (error) {
        console.log('⚠️ Column may already exist:', error.message);
      }
    }
    
    // Add missing column to point_transactions table
    try {
      await sequelize.query('ALTER TABLE "point_transactions" ADD COLUMN IF NOT EXISTS "quiz_id" UUID REFERENCES "quizzes"("id");');
      console.log('✅ Added quiz_id to point_transactions');
    } catch (error) {
      console.log('⚠️ quiz_id column may already exist:', error.message);
    }
    
    console.log('✅ Quiz columns fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing quiz columns:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the fix
fixQuizColumns(); 