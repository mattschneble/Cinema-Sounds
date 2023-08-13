const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Album extends Model{}

Album.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        href: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        movie_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'movie',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'album'
    }
);

module.exports = Album;