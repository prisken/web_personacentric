const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogPostCategory = sequelize.define('BlogPostCategory', {
  blog_post_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'blog_posts',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'blog_categories',
      key: 'id'
    }
  }
}, {
  tableName: 'blog_post_categories',
  timestamps: false
});

module.exports = BlogPostCategory; 