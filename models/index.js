const User = require('./User');
const Post = require('./Post');

/* 
    Define our associations:
    - Each user can have multiple posts
    - Each post can only belong to one user
*/

User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    // onDelete: 'SET NULL'
});

module.exports = { User, Post };