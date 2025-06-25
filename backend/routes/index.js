const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController"); // User logic handlers
const authService = require('../services/authentication');
const userModel = require('../models/userModel'); // User data access for login

// --------------------------------------
// POST /login → Authenticate user credentials
// --------------------------------------
router.post('/login', async (req, res) => {
    try {
        const users = await userModel.getUsers(); // Get all users from database
        await authService.authenticateUser(req.body, users, res); // Validate credentials
    } catch (err) {
        console.error('Login route error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// --------------------------------------
// GET /register → Test registration endpoint (optional usage)
// POST /register → Register a new user
// --------------------------------------
router.get('/register', (req, res) => {
    res.send('Registration endpoint ready');
});

router.post('/register', userController.registerUser);

// --------------------------------------
// GET /logout → Clear access token and log user out
// --------------------------------------
router.get('/logout', (req, res) => {
    res.clearCookie('accessToken'); // Clear JWT cookie
    res.status(200).json({ message: 'Logged out successfully' });
});

// --------------------------------------
// GET / → Basic API status check
// POST / → Log or echo a POST request
// --------------------------------------
router.get('/', (req, res) => {
    res.send("API is running");
});

router.post('/', (req, res) => {
    console.log(req.body); // Log request body
    res.send('Received a POST request');
});

// --------------------------------------
// Export all routes
// --------------------------------------
module.exports = router;