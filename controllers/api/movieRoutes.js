const router = require('express').Router();
const axios = require('axios');
const { replaceSpacesWithPlus } = require('../../utils/helpers'); 
const { Movie } = require('../../models');
const auth = require('../../utils/auth');

// GET all movies
router.get('/', (req, res) => {
    Movie.findAll({
        attributes: [
            'id',
            'Title',
            'Rated',
            'Released',
            'Runtime',
            'Genre',
            'Director',
            'Writer',
            'Actors',
            'Plot',
            'Language',
            'Awards',
            'Poster'
        ]
    })
    .then(dbMovieData => res.json(dbMovieData))
    .catch(err => {
        console.error(err); // Use console.error for errors
        res.status(500).json({ message: 'Error fetching movies' });
    });
});

// GET a specific movie by ID
router.get('/:id', (req, res) => {
    Movie.findByPk(req.params.id, {
        attributes: [
            'id',
            'Title',
            'Rated',
            'Released',
            'Runtime',
            'Genre',
            'Director',
            'Writer',
            'Actors',
            'Plot',
            'Language',
            'Awards',
            'Poster'
        ]
    })
    .then(dbMovieData => {
        if (!dbMovieData) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }
        res.json(dbMovieData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Error fetching movie' });
    });
});

// GET the most recent movie
router.get('/recent', (req, res) => {
    Movie.findOne({
        attributes: [
            'id',
            'Title',
            'Rated',
            'Released',
            'Runtime',
            'Genre'
        ],
        order: [['createdAt', 'DESC']] // Use 'createdAt' instead of 'created_at'
    })
    .then(dbMovieData => {
        if (!dbMovieData) {
            res.status(404).json({ message: 'No movies found' });
            return;
        }
        res.json(dbMovieData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Error fetching recent movie' });
    });
});

// POST a movie
router.post('/', auth, async (req, res) => {
    try {
        // Input validation
        const omdbMovieTitle = req.body.movieTitle;
        if (!omdbMovieTitle) {
            return res.status(400).json({ message: 'Movie title is required' });
        }
        const sanitizedMovieTitle = replaceSpacesWithPlus(omdbMovieTitle);

        // Fetch data from OMDB API
        const omdbApiResponse = await axios.get(`https://www.omdbapi.com/?apikey=63213007&t=${sanitizedMovieTitle}`);

        if (omdbApiResponse.data.Response === 'False') {
            throw new Error('Movie not found on OMDB');
        }

        const omdbMovieData = omdbApiResponse.data;

        // Create a new movie
        const newMovie = await Movie.create({
            Title: omdbMovieData.Title,
            Rated: omdbMovieData.Rated,
            Released: omdbMovieData.Released,
            Runtime: omdbMovieData.Runtime,
            Genre: omdbMovieData.Genre,
            Director: omdbMovieData.Director,
            Writer: omdbMovieData.Writer,
            Actors: omdbMovieData.Actors,
            Plot: omdbMovieData.Plot,
            Language: omdbMovieData.Language,
            Awards: omdbMovieData.Awards,
            Poster: omdbMovieData.Poster,
        });

        res.json(newMovie);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error creating movie' });
    }
});

// Export the router
module.exports = router;
