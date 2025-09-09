const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// Database configuration
if (process.env.NODE_ENV === 'production') {
  // Production: Use PostgreSQL (Railway)
  const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
  console.log('🔄 Connecting to production database:', dbUrl);
  
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  // Development: Use SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
}

module.exports = sequelize; 