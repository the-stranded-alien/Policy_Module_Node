const route = require('express').Router()
const passport = require('../passport')
const Users = require('../db').Users
const { body, validationResult } = require('express-validator');

route.get('/', (req, res) => {
    res.render('home')
})

route.get('/login', (req, res) => {
    res.render('login')
})
route.get('/signup', (req, res) => {
    res.render('signup')
})

route.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
}))

route.post('/signup', 
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }
    Users.create ({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }).then((createUser) => {
        res.redirect('/login')
    })
})

exports = module.exports = route
