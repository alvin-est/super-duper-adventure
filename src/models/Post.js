const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model { 

}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: false, /* let Sequelize pluralize the table name */
        underscored: true,
        modelName: 'post',
    }
);

Post.prototype.getComments = async function() {
    return await this.getComments({ include: [User] });
};

module.exports = Post;