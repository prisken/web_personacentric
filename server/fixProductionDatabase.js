const { sequelize } = require('./models');

async function fixProductionDatabase() {
  try {
    console.log('🔧 Fixing production database...');
    
    // Add missing columns to quizzes table
    await sequelize.query(`
      ALTER TABLE "quizzes" 
      ADD COLUMN IF NOT EXISTS "external_quiz_url" VARCHAR(500),
      ADD COLUMN IF NOT EXISTS "quiz_type" VARCHAR(20) DEFAULT 'internal',
      ADD COLUMN IF NOT EXISTS "external_quiz_id" VARCHAR(100),
      ADD COLUMN IF NOT EXISTS "point_calculation_method" VARCHAR(20) DEFAULT 'percentage',
      ADD COLUMN IF NOT EXISTS "min_score_for_points" INTEGER DEFAULT 70;
    `);
    
    // Add missing column to point_transactions table
    await sequelize.query(`
      ALTER TABLE "point_transactions" 
      ADD COLUMN IF NOT EXISTS "quiz_id" UUID REFERENCES "quizzes"("id");
    `);
    
    console.log('✅ Production database fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing production database:', error);
  } finally {
    await sequelize.close();
  }
}

fixProductionDatabase(); 