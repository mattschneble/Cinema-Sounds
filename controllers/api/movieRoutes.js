const router = require('express').Router();
const axios = require('axios');
const { replaceSpacesWithPlus } = require('../../utils/helpers'); 
const { Movie } = require('../../models');
const auth = require('../../utils/auth');

// SEARCH MOVIE BY NAME
router.get('/search/:keyword', async (req, res) => {
    const omdbApiResponse = await axios.get(`https://www.omdbapi.com/?apikey=63213007&t=${req.params.keyword}`);
    
    const result = omdbApiResponse.data;

    if (result.Response === 'False') {
        return res.send('Movie not found'); 
    }
    // Check if a movie with the same title exists in the database
    const existingMovie = await Movie.findOne({
        where: {
            Title: result.Title,
        },
    });
    if (existingMovie) {
        // Movie already exists in the database
        return res.render("result", {
            logged_in: true,
            movieData: {
                id: result.imdbID,
                poster: result.Poster,
                title: result.Title,
                rated: result.Rated,
                released: result.Released,
                runtime: result.Runtime,
                genre: result.Genre,
                director: result.Director,
                writer: result.Writer,
                actor: result.Actors,
                plot: result.Plot,
                language: result.Language,
                awards: result.Awards
            },
        });
    }
     else {
        // Movie doesn't exist in the database, create a new record
        await Movie.create({
            Title: result.Title,
            Rated: result.Rated,
            Released: result.Released,
            Runtime: result.Runtime,
            Genre: result.Genre,
            Director: result.Director,
            Writer: result.Writer,
            Actors: result.Actors,
            Plot: result.Plot,
            Language: result.Language,
            Awards: result.Awards,
            Poster: result.Poster,
        });

        // Render the result template for the new movie
        res.render("result", {
            logged_in: false,
            movieData: {
                id: result.imdbID,
                poster: result.Poster,
                title: result.Title,
                released: result.Released,
                genre: result.Genre,
                director: result.Director,
            },
        });
    }
});

// GET all movies
router.get('/', async (req, res) => {
    try {
        // Fetch most recent searches from the database
        const recentSearches = await Movie.findAll({
            attributes: ['Title'],
            limit: 3 // Limit the number of recent searches
        });

        // Render the homepage template and pass recent searches data
        res.render('homepage', { recentSearches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching recent searches' });
    }
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
        const omdbMovieTitle = req.body.text;
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

        res.json({ movieData: omdbMovieData, newMovie });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error creating movie' });
    }
});

// Export the router
module.exports = router;
