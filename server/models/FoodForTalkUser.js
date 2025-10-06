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
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Anonymous'
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Participant'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // For clarity: store WhatsApp separately if provided
  whatsapp_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 20, max: 40 }
  },
  occupation: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
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
  },

  // Expanded registration fields
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  expect_person_type: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  dream_first_date: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  dream_first_date_other: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  interests_other: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  attractive_traits: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  attractive_traits_other: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  japanese_food_preference: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  quickfire_magic_item_choice: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  quickfire_desired_outcome: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  consent_accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  tableName: 'food_for_talk_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['email'] },
    { fields: ['is_verified'] },
    { fields: ['is_active'] },
    { fields: ['registration_date'] },
    { fields: ['secret_passkey'] }
  ]
});

module.exports = FoodForTalkUser;
