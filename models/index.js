const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

/* 
    Define our associations:
    - Each user can have multiple posts
    - Each post can only belong to one user
    - A user can have many comments
    - A post can have many comments
    - A comment can only belong to one user or post
*/

User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    // onDelete: 'SET NULL'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
});


module.exports = { User, Post, Comment };