const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialties: {
    type: DataTypes.JSON,
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  availability_schedule: {
    type: DataTypes.JSON,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_documents: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'agents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['is_verified']
    },
    {
      fields: ['rating']
    }
  ]
});

module.exports = Agent; 