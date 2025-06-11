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

const getUser = (id) => {
    const sql = 'SELECT user_id, username, email FROM CCL2_users WHERE user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]); // Return single user
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
    getUser,
    registerUser,
};