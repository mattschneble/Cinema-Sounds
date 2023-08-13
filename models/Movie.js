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
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Rated: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Released: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Runtime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Director: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Writer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Actors: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Plot: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Language: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Awards: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Poster: {
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