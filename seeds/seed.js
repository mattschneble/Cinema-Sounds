const sequelize = require('../config/connection');
const { Movie, Review, User } = require('../models');

const movieData = require('./Movie.json');
const reviewData = require('./Review.json');
const userData = require('./User.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Movie.bulkCreate(movieData, {
    individualHooks: true,
    returning: true,
  });

  await Review.bulkCreate(reviewData, {
    individualHooks: true,
    returning: true,
  });
  
  process.exit(0);
};

seedDatabase();
