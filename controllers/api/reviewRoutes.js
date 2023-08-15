// import express router, needed models, and auth
const router = require('express').Router();
const { Review, Movie, User } = require('../../models');
const auth = require('../../utils/auth');

// GET all reviews
router.get('/', async (req, res) => {
    try {
        const reviewData = await Review.findAll({
            attributes: [
                'id',
                'content',
                'rating',
                'movie_id',
                'user_id'
            ]
        });
        const reviews = reviewData.map((review) => review.get({ plain: true }));
        
        res.render('submitReview', {
            reviews,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err); // Respond with JSON if rendering fails
    }
});


// GET a specific review
router.get('/:id', (req, res) => {
    Review.findByPk(req.params.id, {
        attributes: [
            'id',
            'content',
            'rating',
            'movie_id',
            'user_id'
        ]
    })
    .then(dbReviewData => res.json(dbReviewData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET the most recent review
router.get('/recent', (req, res) => {
    Review.findOne({
        attributes: [
            'id',
            'content',
            'rating',
            'movie_id',
            'user_id'
        ],
        order: [['created_at', 'DESC']]
    })
    .then(dbReviewData => res.json(dbReviewData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST a review
router.post('/', async (req, res) => {
    try {
        const { review, rating } = req.body;
        console.log('Received content:', review);
        console.log('Received rating:', rating);
        const { movie_id, user_id } = req.session;

        // Create the new review
        await Review.create({
            content: review, 
            rating: rating,   
            movie_id: movie_id,
            user_id: user_id
        });

        const newReviews = await Review.findAll({
            include: [
                {
                    model: Movie,
                    attributes: ['id', 'Title', 'Poster'],
                },
                {
                    model: User,
                    attributes: ['id'],
                },
            ],
        });

        const reviews = newReviews.map((review) => review.get({ plain: true }));
        console.log('Retrieved reviews:', reviews);

        res.render('submitReview', {
            reviews: reviews
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error creating review', detailedError: err.message });
    }
});




// DELETE a review
router.delete('/:id', (req, res) => {
    Review.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbReviewData => {
        if (!dbReviewData) {
            res.status(404).json({message: "No review has been found with this id, and no deletion has occurred. Please try again."});
            return;
        }
        res.json(dbReviewData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// export the router
module.exports = router;