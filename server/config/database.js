const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// Database configuration
if (process.env.NODE_ENV === 'production') {
  // Production: Use PostgreSQL (Railway)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
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