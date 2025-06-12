const express = require('express')
const router = express.Router()
const carController = require('../controllers/carsController')
const authService = require('../services/authentication');

//GET ALL CARS
router.get('/', carController.getAllCars) // public
//GET ONE CAR
router.get('/:id', carController.getCarById)

router.post('/addCar', authService.authenticateJWT, authService.isAdmin, carController.addCar);
router.put('/:id', authService.authenticateJWT, authService.isAdmin, carController.editCar);
router.delete('/:id', authService.authenticateJWT, authService.isAdmin, carController.deleteCar);

module.exports = router