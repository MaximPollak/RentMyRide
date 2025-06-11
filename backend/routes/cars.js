const express = require('express')
const router = express.Router()
const carController = require('../controllers/carsController')

//GET ALL CARS
router.get('/', carController.getAllCars) // public
//GET ONE CAR
router.get('/:id', carController.getCarById)
//ADD A CAR TO RENT
router.post('/add', carController.addCar)    // admin-only later
//EDIT A CAR
router.put('/:id/', carController.editCar)
//DELETE A CAR
router.delete('/:id/', carController.deleteCar)

module.exports = router