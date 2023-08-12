const router = require('express').Router();
const axios = require('axios');
const { Movie } = require('../../models');
const auth = require('../../utils/auth');

// GET all movies
router.get('/', auth, (req, res) => {
    Movie.findAll({
        attributes: [
            'id',
            'name',
            'rating',
            'runtime',
            'genre',
            'director',
            'writer',
            'plot',
            'language',
            'awards',
            'movie_poster'
        ]
    })
    .then(dbMovieData => res.json(dbMovieData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET a specific movies
router.get('/:id', auth, (req, res) => {
    Movie.findByPk({
        attributes: [
            'id',
            'name',
            'rating',
            'runtime',
            'genre',
            'director',
            'writer',
            'plot',
            'language',
            'awards',
            'movie_poster'
        ]
    })
    .then(dbMovieData => res.json(dbMovieData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET the most recent review
router.get('/recent', (req, res) => {
    Movie.findOne({
        attributes: [
            'id',
            'name',
            'rating',
            'runtime',
            'genre'
        ],
        order: [['created_at', 'DESC']]
    })
    .then(dbMovieData => res.json(dbMovieData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST a movie
router.post('/', withAuth, async (req, res) => {
    try {
      // Fetch data from OMDB API
      const omdbApiKey = 'YOUR_OMDB_API_KEY'; // Replace with OMDB API key
      const omdbMovieTitle = req.body.movieTitle; 
  
      const omdbApiResponse = await axios.get(`http://www.omdbapi.com/?apikey=${omdbApiKey}&t=${omdbMovieTitle}`);
  
      if (omdbApiResponse.data.Response === 'False') {
        throw new Error('Movie not found on OMDB');
      }
  
      const omdbMovieData = omdbApiResponse.data;
  
      // Create a new movie 
      const newMovie = await Movie.create({
        title: omdbMovieData.Title,
        // Add other relevant properties
      });
  
      res.json(newMovie);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Error creating movie' });
    }
  });

// DELETE a movie
router.delete('/:id', auth, (req, res) => {
    Review.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbMovieData => {
        if (!dbMovieData) {
            res.status(404).json({message: "No movie has been found with this id, and no deletion has occurred. Please try again."});
            return;
        }
        res.json(dbMovieData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// export the router
module.exports = router;