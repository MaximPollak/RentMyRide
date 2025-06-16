const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController"); // User-related logic
const authService = require('../services/authentication'); // JWT auth service

// 🔐 Protect all /users routes with JWT
router.use(authService.authenticateJWT);

//Protected route - List all users
router.get('/', userController.getUsers);

// ✅ Route to get current logged-in user
router.get('/me', (req, res) => {
    userController.getUser({ ...req, params: { id: req.user.id } }, res);
});

//for admin-only user management
router.get('/:id', userController.getUser);

//updating an user
router.put('/:id', userController.updateUser);

//deleting an user
router.delete('/:id', userController.deleteUser)

module.exports = router;