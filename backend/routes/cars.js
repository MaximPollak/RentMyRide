const express = require('express')
const router = express.Router()
const carController = require('../controllers/carsController')

router.get('/', carController.getAllCars) // public
router.get('/:id', carController.getCarById)
router.post('/addcar', carController.addCar)    // admin-only later
router.put('/:id/editcar', carController.editCar)
router.delete('/:id/remove', carController.deleteCar)

module.exports = router