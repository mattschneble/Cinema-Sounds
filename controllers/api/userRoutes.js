// import express router and models
const router = require('express').Router();
const {Movie, User, Review} = require('../../models');
// import auth middleware
const auth = require('../../utils/auth');

// GET all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET a single user by id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Review,
                attributes: ['id', 'review_text', 'review_title', 'created_at'],
                include: {
                    model: Movie,
                    attributes: ['id', 'title', 'rating']
                }
            },
            {
                model: Movie,
                attributes: ['id', 'title', 'rating']
            }
        ]
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
})

// A new user signs up
router.post('/signup', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        // create a session variable based on the user's id
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.email = dbUserData.email;
            req.session.password = dbUserData.password;
            req.session.logged_in = true;
            
            res.json({ user: dbUserData, logged_in: true });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// An existing user logs in
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
        }
    })
    .then(dbUserData => {
        // if the username is not found, send an error
        if (!dbUserData) {
            res.status(400).json({message: 'No user found with that username'});
            return;
        }

        // otherwise, verify the user
        const validPassword = dbUserData.checkPassword(req.body.password);

        // if the password is invalid, send an error
        if (!validPassword) {
            res.status(400).json({message: 'Incorrect password'});
            return;
        }

        // otherwise, save the session, and return the user object and a success message
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.password = dbUserData.password;
            req.session.logged_in = true;

            res.json({user: dbUserData, message: 'You are now logged in', logged_in: true });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// A user logs out
router.post('/logout', auth, (req, res) => {
    // if the user is logged in, destroy the session and return a success message
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    // otherwise, send an error
    } else {
        res.status(404).end();
    }
});

// export the router
module.exports = router;