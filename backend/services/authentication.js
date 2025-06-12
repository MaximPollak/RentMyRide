const jwt = require('jsonwebtoken'); // Library to create and verify JWT tokens
const bcrypt = require('bcrypt');    // Library to securely compare hashed passwords
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/**
 * Authenticate a user based on email and password.
 * If valid, creates a JWT token and sends it as JSON.
 *
 * @param {Object} credentials - { email, password }
 * @param {Array} users - List of users from DB
 * @param {Object} res - Express response object
 */
/**
 * Authenticate a user based on email and password.
 * Creates JWT if login succeeds and stores it in a cookie.
 */
async function authenticateUser({ email, password }, users, res) {
    const user = users.find((u) => u.email === email); // Look for user with matching email

    // Only continue if user exists and password is valid
    if (user && await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
            { id: user.user_id || user.id, name: user.username },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Store token in cookie
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.status(200).json({
            message: 'Login successful',
            token: accessToken,
            user: {
                id: user.user_id || user.id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        // Invalid credentials
        res.status(401).json({ error: 'Username or password incorrect' });
    }
}

/**
 * Middleware to authenticate protected routes using token in headers.
 */
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'Access token missing' });

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });

        req.user = user; // Attach decoded user to request
        next();
    });
}

/**
 * Compare plain text password with hashed version
 */
async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    authenticateUser,
    authenticateJWT,
};