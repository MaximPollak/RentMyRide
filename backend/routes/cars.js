const express = require('express');
const router = express.Router();
const carController = require('../controllers/carsController');
const upload = require('../services/upload'); // Middleware for handling image uploads
const authService = require('../services/authentication'); // Middleware for JWT and admin verification

// GET /cars → Public endpoint to retrieve all cars
router.get('/', carController.getAllCars);

// GET /cars/available → Retrieve only cars that are marked as available
router.get('/available', carController.getAvailableCars);

// GET /cars/refresh-availability → Refresh availability of cars whose bookings have ended
router.get('/refresh-availability', carController.refreshCarAvailability);

// GET /cars/:id → Retrieve a specific car by its ID
router.get('/:id', carController.getCarById);

// POST /cars/addCar → Admin-only endpoint to add a new car with image upload
router.post(
    '/addCar',
    authService.authenticateJWT,     // Ensure the user is authenticated
    authService.isAdmin,             // Ensure the user has admin privileges
    upload.single('image'),          // Process uploaded image
    carController.addCar             // Add the car to the database
);

// PUT /cars/:id → Admin-only endpoint to edit an existing car, optionally replacing the image
router.put(
    '/:id',
    authService.authenticateJWT,
    authService.isAdmin,
    upload.single('image'),
    carController.editCar
);

// DELETE /cars/:id → Admin-only endpoint to delete a car by ID
router.delete(
    '/:id',
    authService.authenticateJWT,
    authService.isAdmin,
    carController.deleteCar
);

// Export all car-related routes
module.exports = router;