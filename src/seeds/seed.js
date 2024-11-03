const sequelize = require('../config/connection.js');
const { User, Post, Comment } = require('../models/index.js');

const userData = require('./users.json');
const postData = require('./posts.json');
const commentData = require('./comments.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  });

  await Comment.bulkCreate(commentData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
