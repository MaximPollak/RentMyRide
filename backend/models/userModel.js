const db = require('../services/database').config; // Database connection
const bcrypt = require('bcrypt'); // Library for hashing passwords securely

/**
 * Adds a new user to the database.
 * Password is hashed before being saved.
 */
const addUser = async ({ username, email, password = 'user' }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO CCL2_users (username, email, password) VALUES (?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) return reject(err);
            resolve({ user_id: result.insertId, username, email });
        });
    });
};

module.exports = {
    addUser
};