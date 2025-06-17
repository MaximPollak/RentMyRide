const express = require('express')
const router = express.Router()
const carController = require('../controllers/carsController');
const upload = require('../services/upload'); // ✅ import the upload middleware
const authService = require('../services/authentication');

//GET ALL CARS
router.get('/', carController.getAllCars) // public

router.get('/available', carController.getAvailableCars);

router.get('/refresh-availability', carController.refreshCarAvailability);

//GET ONE CAR
router.get('/:id', carController.getCarById)

router.post('/addCar',
    authService.authenticateJWT,  // 🥇 First: check if user is logged in
    authService.isAdmin,          // 🥈 Then: confirm they're an admin
    upload.single('image'),       // 🥉 Now safe to accept file
    carController.addCar          // ✅ Finally: handle logic
);

router.put('/:id', authService.authenticateJWT, authService.isAdmin, upload.single('image'), carController.editCar
);

router.delete('/:id', authService.authenticateJWT, authService.isAdmin, carController.deleteCar);


module.exports = router