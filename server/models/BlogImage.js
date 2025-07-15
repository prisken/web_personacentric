const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const BlogImage = sequelize.define('BlogImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  blog_post_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'blog_posts',
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  alt_text: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  image_type: {
    type: DataTypes.ENUM('featured', 'content', 'gallery'),
    defaultValue: 'content'
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'blog_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BlogImage; 