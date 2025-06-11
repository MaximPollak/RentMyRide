const userModel = require('../models/userModel');

/**
 * Controller for registering a new user.
 * Validates input and calls the model to save to DB.
 */
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await userModel.addUser({ username, email, password });
        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

module.exports = {
    registerUser
};