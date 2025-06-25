const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController"); // Handles user-related operations
const authService = require('../services/authentication'); // JWT authentication middleware

// Apply JWT authentication to all routes in this file
router.use(authService.authenticateJWT);

// GET /users → Admin-only: Retrieve all users
router.get('/', userController.getUsers);

// GET /users/me → Get data of the currently logged-in user
router.get('/me', (req, res) => {
    // Call the getUser controller with the current user's ID from the JWT token
    userController.getUser({ ...req, params: { id: req.user.id } }, res);
});

// GET /users/:id → Admin-only: Retrieve a user by ID
router.get('/:id', userController.getUser);

// PUT /users/:id → Update a user's information (can include password)
router.put('/:id', userController.updateUser);

// DELETE /users/:id → Delete a user by ID
router.delete('/:id', userController.deleteUser);

// Export all user-related routes
module.exports = router;