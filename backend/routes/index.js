const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController"); // User-related logic
const authService = require('../services/authentication');
const userModel = require('../models/userModel'); // Access to users for login matching

// --------------------------------------
// LOGIN ROUTE
// --------------------------------------
router.post('/login', async (req, res) => {
    try {
        const users = await userModel.getUsers(); // fetch all users
        await authService.authenticateUser(req.body, users, res); // check login
    } catch (err) {
        console.error('Login route error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// --------------------------------------
// REGISTRATION ROUTES
// --------------------------------------
router.get('/register', (req, res) => {
    res.render('registerUser');
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