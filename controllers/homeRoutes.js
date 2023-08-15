const router = require('express').Router();
const { Movie, Review, User } = require('../models');
const auth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get the three most recent movies and JOIN with related data
    const recentSearches = await Movie.findAll({
      include: [
        {
          model: Review,
          attributes: ['content', 'rating', 'movie_id', 'user_id' ],
        },
      ],
    });

    // Serialize data so the template can read it
    const movies = recentSearches.map((movies) => movies.get({ plain: true }));
    console.log(movies);
    // Pass serialized data and session flag into the template
    res.render('homepage', {
      movies,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/movie/:id', async (req, res) => {
  try {
    const movieData = await Movie.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          attributes: ['content'],
        },
      ],
    });

    const movie = movieData.get({ plain: true });

    res.render('homepage', {
      ...movie,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', auth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;