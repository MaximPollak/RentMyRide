const jwt = require('jsonwebtoken'); // Library to create and verify JWT tokens
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; // Secret key from .env for signing tokens
const bcrypt = require('bcrypt'); // Library to securely compare hashed passwords

/**
 * Authenticate a user based on email and password.
 * If valid, creates a JWT token, stores it in a cookie, and redirects to user's profile.
 *
 * @param {Object} credentials - Contains email and plain text password.
 * @param {Array} users - List of users from database.
 * @param {Object} res - Express response object.
 */
async function authenticateUser({email, password}, users, res) {
    const user = users.find((u) => u.email === email); // Find user by email

    // If user exists and password is valid
    if (user && await checkPassword(password, user.password)) {
        // Create JWT with user ID and name, expires in 1 hour
        const accessToken = jwt.sign(
            { id: user.user_id || user.id, name: user.username },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Store token in cookie
        res.cookie('accessToken', accessToken);
        // Redirect to user profile page
        res.redirect('/users/' + (user.user_id || user.id));
    } else {
        // Invalid login
        res.send('Username or password incorrect');
    }
}

/**
 * Middleware to authenticate routes using JWT stored in cookies.
 * If valid, attaches user info to req.user and proceeds.
 */
function authenticateJWT(req, res, next) {
    const token = req.cookies['accessToken']; // Read JWT from cookie

    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403); // Token invalid or expired
                return next(err);
            }

            console.log(user); // Log decoded token for debugging
            req.user = user; // Attach user data to request
            next(); // Continue to route
        });
    } else {
        res.status(401); // No token present
        next(new Error('Access token missing'));
    }
}

/**
 * Compares a plain password with its hashed version using bcrypt.
 * @param {string} password - Plain text password.
 * @param {string} hash - Hashed password from DB.
 * @returns {Promise<boolean>} Result of password comparison.
 */
async function checkPassword(password, hash) {
    let pw = await bcrypt.compare(password, hash); // bcrypt handles salt internally
    return pw;
}

// Export authentication functions for use in routes and middleware
module.exports = {
    authenticateUser,
    authenticateJWT,
}