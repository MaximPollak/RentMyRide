const db = require('../services/database').config; // Get configured DB connection
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

/**
 * Fetch all users from the database.
 * @returns {Promise<Array>} Resolves with an array of user objects
 */
const getUsers = () => {
    const sql = 'SELECT * FROM CCL2_users';

    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) return reject(err); // Query failed
            resolve(results); // Return all users
        });
    });
};

/**
 * Get a single user by ID (excluding password for security).
 * @param {number} id - ID of the user to retrieve
 * @returns {Promise<Object|null>} Resolves with user data or null if not found
 */
const getUser = (id) => {
    const sql = 'SELECT user_id, username, email, created_at, role FROM CCL2_users WHERE user_id = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, results) => {
            if (err) return reject(err); // Query failed
            if (results.length === 0) return resolve(null); // User not found
            resolve(results[0]); // Return single user object
        });
    });
};

/**
 * Update an existing user's info (username, email, password).
 * Password must be hashed before calling this function!
 *
 * @param {number} id - User ID to update
 * @param {Object} param1 - Object containing new values
 * @returns {Promise<Object>} Confirmation message
 */
const updateUser = (id, { username, email, password }) => {
    const sql = 'UPDATE CCL2_users SET username = ?, email = ?, password = ? WHERE user_id = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [username, email, password, id], (err, result) => {
            if (err) return reject(err); // Update failed
            resolve({ message: 'User updated', id }); // Return success info
        });
    });
};

/**
 * Register a new user (with default password if not given).
 * Hashes the password before inserting into DB.
 *
 * @param {Object} userData - Must contain username, email, password (optional)
 * @returns {Promise<Object>} Returns inserted user info (without password)
 */
const registerUser = async ({ username, email, password = 'user' }) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Securely hash password

    const sql = 'INSERT INTO CCL2_users (username, email, password) VALUES (?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) return reject(err); // Insert failed
            resolve({ user_id: result.insertId, username, email }); // Return new user (no password)
        });
    });
};

/**
 * Delete a user by ID
 * @param {number} id - ID of the user to delete
 * @returns {Promise<Object>} Confirmation message
 */
const deleteUser = (id) => {
    const sql = 'DELETE FROM CCL2_users WHERE user_id = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err); // Delete failed
            resolve({ message: 'User deleted', id }); // Return confirmation
        });
    });
};

// Export all user-related DB functions
module.exports = {
    getUsers,
    getUser,
    updateUser,
    registerUser,
    deleteUser
};