const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Movie extends Model{}

Movie.init(
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
        rated: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        released: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        runtime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        director: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        writer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        actors: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        plot: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        awards: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        poster: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'movie'
    }
);

module.exports = Movie;