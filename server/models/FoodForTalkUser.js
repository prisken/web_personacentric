const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodForTalkUser = sequelize.define('FoodForTalkUser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 20,
      max: 40
    }
  },
  occupation: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  interests: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  dietary_restrictions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergency_contact_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  emergency_contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  profile_photo_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  secret_passkey: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'food_for_talk_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['is_verified']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['registration_date']
    },
    {
      fields: ['secret_passkey']
    }
  ]
});

// Expanded registration fields
FoodForTalkUser.prototype.extraFields = true;


module.exports = FoodForTalkUser;
