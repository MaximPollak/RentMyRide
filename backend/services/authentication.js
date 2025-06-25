const jwt = require('jsonwebtoken'); // Used to sign and verify JWT tokens
const bcrypt = require('bcrypt');    // Used to hash and compare passwords securely
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/**
 * Authenticate a user by comparing email and password.
 * If valid, generate a JWT and send it as an httpOnly cookie and in the JSON response.
 *
 * @param {Object} credentials - Contains email and password
 * @param {Array} users - List of users from the database
 * @param {Object} res - Express response object
 */
async function authenticateUser({ email, password }, users, res) {
    const user = users.find((u) => u.email === email); // Find user by email

    if (user && await bcrypt.compare(password, user.password)) {
        // Password matches, create JWT token
        const accessToken = jwt.sign(
            { id: user.user_id, name: user.username, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Send token as an httpOnly cookie and include user info in response
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.status(200).json({
            message: 'Login successful',
            token: accessToken,
            user: {
                id: user.user_id || user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } else {
        // User not found or password incorrect
        res.status(401).json({ error: 'Username or password incorrect' });
    }
}

/**
 * Middleware to verify JWT token from cookies.
 * Protects routes by allowing only authenticated requests through.
 */
function authenticateJWT(req, res, next) {
    const token = req.cookies['accessToken']; // Read token from cookie

    if (!token) {
        return res.status(401).json({ error: 'Access token missing' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = user; // Attach user payload from token to request
        next(); // Continue to route
    });
}

/**
 * Middleware to allow access only to admin users.
 */
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next(); // User is admin, allow access
    } else {
        return res.status(403).json({ error: 'Admin access required' });
    }
}

// Export authentication functions
module.exports = {
    authenticateUser,
    authenticateJWT,
    isAdmin
};