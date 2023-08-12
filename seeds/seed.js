const sequelize = require('../config/connection');
const { Movie } = require('../models');

const movieData = require('./Movie.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Movie.bulkCreate(movieData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
