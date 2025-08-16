const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gift = sequelize.define('Gift', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'gift_categories',
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Cloudinary URL for gift image'
  },
  points_required: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'inactive', 'out_of_stock', 'discontinued'),
    defaultValue: 'draft'
  },
  availability_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  availability_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'gifts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Gift;