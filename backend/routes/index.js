const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController"); // User-related logic
const authenticationService = require('../services/authentication'); // JWT auth service
const userModel = require('../models/userModel'); // Access to users for login matching

// --------------------------------------
// LOGIN ROUTE
// --------------------------------------
router.route('/login')
    .get((req, res) => {
        res.render('login'); // Render login form (views/login.ejs)
    })
    .post((req, res) => {
        userModel.getUsers()
            .then((users) => {
                authenticationService.authenticateUser(req.body, users, res); // Handles JWT + password match
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });

// --------------------------------------
// REGISTRATION ROUTES
// --------------------------------------
router.get('/register', (req, res) => {
    res.render('registerUser'); // Render registration form (views/registerUser.ejs)
});

router.post('/register', userController.registerUser);

// --------------------------------------
// LOGOUT
// --------------------------------------
router.get('/logout', (req, res) => {
    res.cookie("accessToken", '', { maxAge: 0 }); // Expire the cookie
    res.redirect('/');
});

// --------------------------------------
// HOME ROUTES
// --------------------------------------
router.get('/', (req, res) => {
    res.render("index", { title: "Express" });
});

router.post('/', (req, res) => {
    console.log(req.body);
    res.send('received a POST request');
})


// --------------------------------------
// EXPORT ROUTER
// --------------------------------------
module.exports = router;