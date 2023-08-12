// import express router, needed models, and auth
const router = require('express').Router();
const { Review } = require('../../models');
const auth = require('../../utils/auth');

// GET all reviews
router.get('/', auth, (req, res) => {
    Review.findAll({
        attributes: [
            'id',
            'review_text',
            'review_title',
            'created_at'
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
            'review_text',
            'review_title',
            'created_at'
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
router.post('/', auth, (req, res) => {
    Review.create({
        review_text: req.body.review_text,
        review_title: req.body.review_title,
        user_id: req.session.user_id
    })
    .then(dbReviewData => res.json(dbReviewData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

// DELETE a review
router.delete('/:id', auth, (req, res) => {
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