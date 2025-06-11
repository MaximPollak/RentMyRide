const userModel = require('../models/userModel');

const getUsers = (req, res) => {
    userModel.getUsers()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.error('Failed to fetch users:', err);
            res.status(500).json({ error: 'Could not retrieve users' });
        });
};

const getUser = (req, res) => {
    const userId = req.params.id;

    userModel.getUser(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Could not retrieve user' });
        });
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.updateUser(userId, { username, email, password: hashedPassword });
        res.status(200).json(result);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Update failed' });
    }
};

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
        const user = await userModel.registerUser({ username, email, password });
        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const deleteUser = (req, res) => {
    const userId = req.params.id;

    userModel.deleteUser(userId)
        .then(result => res.status(200).json(result))
        .catch(err => {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Delete failed' });
        });
};

module.exports = {
    getUsers,
    getUser,
    updateUser,
    registerUser,
    deleteUser
};