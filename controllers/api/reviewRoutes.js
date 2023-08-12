// import express router, needed models, and auth
const router = require('express').Router();
const { Review } = require('../../models');
const auth = require('../../utils/auth');

// GET all reviews
router.get('/', (req, res) => {
    Review.findAll({
        attributes: [
            'id',
            'content'
        ]
    })
    .then(dbReviewData => res.json(dbReviewData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET a specific review
router.get('/:id', (req, res) => {
    Review.findByPk(req.params.id, {
        attributes: [
            'id',
            'content'
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
            'content'
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
router.post('/', (req, res) => {
    Review.create({
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbReviewData => res.json(dbReviewData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
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