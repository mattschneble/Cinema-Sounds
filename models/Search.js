const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Search extends Model{}

Search.init(
    {    
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        movieId: {
            type: String,
            required: true
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'search'
    }
);

module.exports = Search;