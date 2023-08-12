const User = require('./User');
const Album = require('./Album');
const Movie = require('./Movie');
const Review = require('./Review');

User.hasMany(Review, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Movie.hasMany(Review, {
    foreignKey: 'movie_id'
});

Review.belongsTo(User, {
    foreignKey: 'user_id'
});

Review.belongsTo(Movie, {
    foreignKey: 'movie_id'
});

Album.belongsTo(Movie, {
    foreignKey: 'movie_id'
});

module.exports = { User, Album, Movie, Review };