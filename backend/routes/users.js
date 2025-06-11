const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController"); // User-related logic
const authenticationService = require('../services/authentication'); // JWT auth service

//Protected route - List all users
router.get('/', userController.getUsers);

//view your profile
router.get('/:id', userController.getUser);

module.exports = router;