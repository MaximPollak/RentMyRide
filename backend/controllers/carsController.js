const carModel = require('../models/carsModel')


//---------------------
//----GETTING ALL CARS-----
//---------------------
const getAllCars = (req, res, next) => {
    carModel.getAllCars()
        .then(cars => res.status(200).json(cars))
        .catch(err => res.status(401).json(err)) // Passes error to Express's error handler
}

//---------------------
//----GETTING CAR BY ID----
//---------------------
const getCarById = (req, res, next) => {
    const carId = req.params.id
    carModel.getCarById(carId)
        .then(car => {
            if (!car) return res.status(404).json({ error: 'Car not found' })
            res.status(200).json(car)
        })
        .catch(err => {
            console.error('Error fetching car:', err)
            res.status(500).json({ error: 'Failed to fetch car' })
        })
}

//---------------------
//----ADDING CAR-------
//---------------------
const addCar = (req, res, next) => {
    const carData = req.body

    carModel.addCar(carData)
        .then(newCar => res.status(201).json(newCar))
        .catch(err => {
            console.error('Error adding car:', err)
            res.status(500).json({ error: 'Failed to add car' })
        })
}

//---------------------
//----EDIT CAR-----
//---------------------
const editCar = (req, res, next) => {
    const carId = req.params.id
    const carData = req.body

    carModel.editCar(carId, carData)
        .then(response => res.status(200).json(response))
        .catch(err => {
            console.error('Error updating car:', err)
            res.status(500).json({ error: 'Failed to update car' })
        })
}

const deleteCar = (req, res, next) => {
    const carId = req.params.id

    carModel.deleteCar(carId)
        .then(response => res.status(200).json(response))
        .catch(err => {
            console.error('Error deleting car:', err)
            res.status(500).json({ error: 'Failed to delete car' })
        })
}

module.exports = {
    getAllCars,
    getCarById,
    addCar,
    editCar,
    deleteCar,
}