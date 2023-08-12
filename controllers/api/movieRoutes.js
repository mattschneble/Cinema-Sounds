const router = require('express').Router();
const axios = require('axios');
const { Movie } = require('../../models');
const auth = require('../../utils/auth');

// GET all movies
router.get('/', auth, (req, res) => {
    Movie.findAll({
        attributes: [
            'id',
            'title',
            'rated',
            'released',
            'runtime',
            'genre',
            'director',
            'writer',
            'actors',
            'plot',
            'language',
            'awards',
            'poster'
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
            'title',
            'rated',
            'released',
            'runtime',
            'genre',
            'director',
            'writer',
            'actors',
            'plot',
            'language',
            'awards',
            'poster'
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
            'title',
            'rated',
            'released',
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
        title: omdbMovieData.title,
        rated: omdbMovieData.rated,
        released: omdbMovieData.released,
        runtime: omdbMovieData.runtime,
        genre: omdbMovieData.genre,
        director: omdbMovieData.director,
        writer: omdbMovieData.writer,
        actors: omdbMovieData.actors,
        plot: omdbMovieData.plot,
        language: omdbMovieData.language,
        awards: omdbMovieData.awards,
        poster: omdbMovieData.poster,

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