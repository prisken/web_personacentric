const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  specialization: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  experience_years: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  certifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  profile_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  areas_of_expertise: {
    type: DataTypes.JSON,
    allowNull: true
  },
  languages: {
    type: DataTypes.JSON,
    allowNull: true
  },
  preferred_client_types: {
    type: DataTypes.JSON,
    allowNull: true
  },
  communication_modes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  availability: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'active', 'inactive'),
    defaultValue: 'pending'
  },
  in_matching_pool: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'agents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Agent; 