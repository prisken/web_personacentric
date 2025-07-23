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
    allowNull: false,
    validate: {
      min: 0
    }
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
    allowNull: false,
    validate: {
      min: 0,
      max: 1
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  profile_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Cloudinary URL for agent profile image'
  },
  // New fields for matching system
  // areas_of_expertise: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   comment: 'Array of areas of expertise (Retirement, Investment, Tax, etc.)'
  // },
  // languages: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   comment: 'Array of languages spoken'
  // },
  // preferred_client_types: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   comment: 'Array of preferred client types (Young professionals, Families, etc.)'
  // },
  // communication_modes: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   comment: 'Array of communication modes (In-person, Video, Phone, Digital)'
  // },
  // availability: {
  //   type: DataTypes.TEXT,
  //   allowNull: true,
  //   comment: 'Availability schedule (JSON string or text)'
  // },
  // location: {
  //   type: DataTypes.STRING(255),
  //   allowNull: true
  // },
  // status: {
  //   type: DataTypes.ENUM('pending', 'approved', 'active', 'inactive'),
  //   defaultValue: 'pending'
  // },
  // in_matching_pool: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false
  // }
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
      fields: ['specialization']
    },
    {
      fields: ['is_verified']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['status']
    },
    {
      fields: ['in_matching_pool']
    }
  ]
});

module.exports = Agent; 