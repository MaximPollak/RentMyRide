const userModel = require('../models/userModel'); // DB layer for user operations
const bcrypt = require('bcrypt'); // For password hashing

/**
 * Get all users from the database (admin view)
 */
const getUsers = (req, res) => {
    userModel.getUsers()
        .then(users => res.status(200).json(users)) // Return full user list
        .catch(err => {
            console.error('Failed to fetch users:', err);
            res.status(500).json({ error: 'Could not retrieve users' });
        });
};

/**
 * Get a specific user by ID
 */
const getUser = (req, res) => {
    const userId = req.params.id;

    userModel.getUser(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user); // Return user object
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Could not retrieve user' });
        });
};

/**
 * Update an existing user's information
 * - Username and email are required
 * - Password is optional and will be hashed if provided
 */
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    // Basic input validation
    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    try {
        let updatedData = { username, email };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Secure the password
            updatedData.password = hashedPassword;
        }

        const result = await userModel.updateUser(userId, updatedData);
        res.status(200).json(result); // Return confirmation
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Update failed' });
    }
};

/**
 * Register a new user account
 * - Validates all required fields
 * - Calls model to insert new user (with hashed password)
 */
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Ensure all required data is present
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await userModel.registerUser({ username, email, password });
        res.status(201).json({ message: 'User registered', user }); // Success response
    } catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Delete a user account by ID
 */
const deleteUser = (req, res) => {
    const userId = req.params.id;

    userModel.deleteUser(userId)
        .then(result => res.status(200).json(result)) // Return success message
        .catch(err => {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Delete failed' });
        });
};

// Export all controller functions
module.exports = {
    getUsers,
    getUser,
    updateUser,
    registerUser,
    deleteUser
};