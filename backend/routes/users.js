const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController"); // User-related logic
const authenticationService = require('../services/authentication'); // JWT auth service

//Protected route - List all users
router.get('/', userController.getUsers);

//view your profile
router.get('/:id', userController.getUser);

//updating an user
router.put('/:id', userController.updateUser);

//deleting an user
router.delete('/:id', userController.deleteUser)

module.exports = router;