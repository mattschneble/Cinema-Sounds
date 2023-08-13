const router = require('express').Router();
const axios = require('axios');
const { Album } = require('../../models');
const auth = require('../../utils/auth');

// GET all Albums
router.get('/', (req, res) => {
    Album.findAll({
        attributes: [
            'id',
            'name',
            'href',
            'movie_id'
        ]
    })
    .then(dbAlbumData => res.json(dbAlbumData))
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error fetching albums' });
    });
});

// GET a specific Album
router.get('/:id', (req, res) => {
    Album.findByPk(req.params.id, {
        attributes: [
            'id',
            'name',
            'href',
            'movie_id'
        ]
    })
    .then(dbAlbumData => res.json(dbAlbumData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET the most recent Album
router.get('/recent', (req, res) => {
    Album.findOne({
        attributes: [
            'id',
            'name',
            'href',
            'movie_id'
        ],
        order: [['created_at', 'DESC']]
    })
    .then(dbAlbumData => res.json(dbAlbumData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST a Album
router.post('/', async (req, res) => {
    try {
      // Fetch data from Spotify API
      const spotifyAlbumId = req.body.movieTitle; 
  
      const spotifyApiResponse = await axios.get(`https://api.spotify.com/v1/albums/${spotifyAlbumId}`);
  
      if (spotifyApiResponse.data.Response === 'False') {
        throw new Error('Album not found on Spotify');
      }
  
      const spotifyAlbumData = spotifyApiResponse.data;
  
      // Create a new Album 
      const newAlbum = await Album.create({
        name: spotifyAlbumData.name,
        href: spotifyAlbumData.href,
        total_plays: spotifyAlbumData.total_plays,
      });
  
      res.json(newAlbum);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Error creating Album' });
    }
  });

// DELETE a Album
router.delete('/:id', (req, res) => {
    Album.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbAlbumData => {
        if (!dbAlbumData) {
            res.status(404).json({message: "No Album has been found with this id, and no deletion has occurred. Please try again."});
            return;
        }
        res.json(dbAlbumData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// export the router
module.exports = router;