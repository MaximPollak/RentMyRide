const db = require('../services/database').config; // Database connection
const bcrypt = require('bcrypt'); // Library for hashing passwords securely

const getUsers = () => {
    const sql = 'SELECT username, email, created_at FROM CCL2_users';

    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Adds a new user to the database.
 * Password is hashed before being saved.
 */
const registerUser = async ({ username, email, password = 'user' }) => {
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
    getUsers,
    registerUser,
};