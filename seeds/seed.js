const sequelize = require('../config/connection');
const { Movie, Review, Album } = require('../models');

const movieData = require('./Movie.json');
const reviewData = require('./Review.json');
const albumData = require('./Album.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Movie.bulkCreate(movieData, {
    individualHooks: true,
    returning: true,
  });

  await Review.bulkCreate(reviewData, {
    individualHooks: true,
    returning: true,
  });

  await Album.bulkCreate(albumData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
