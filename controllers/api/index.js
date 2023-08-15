const router = require('express').Router();
const movieRoutes = require('./movieRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');


router.use('/movie', movieRoutes);
router.use('/review', reviewRoutes);
router.use('/user', userRoutes);


module.exports = router;