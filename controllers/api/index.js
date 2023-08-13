const router = require('express').Router();
const albumRoutes = require('./albumRoutes');
const movieRoutes = require('./movieRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');

// router.use('/album', albumRoutes);
router.use('/movie', movieRoutes);
router.use('/review', reviewRoutes);
router.use('/user', userRoutes);
router.use('/album', albumRoutes);

module.exports = router;