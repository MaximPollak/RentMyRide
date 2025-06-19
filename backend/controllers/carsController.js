const carModel = require('../models/carsModel');
const fs = require('fs');
const path = require('path');


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
    // Check if file is present
    if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
    }
    // Build image path to save in DB
    const imageUrl = `/uploads/${req.file.filename}`;

    // Extract car data and add image_url
    const carData = {
        ...req.body,
        image_url: imageUrl,
        available: 1
    };

    console.log('🚗 carData to insert:', carData);
    console.log('Received file:', req.file);
    console.log('Received body:', req.body);

    carModel.addCar(carData)
        .then(newCar => res.status(201).json(newCar))
        .catch(err => {
            console.error('Error adding car:', err);
            res.status(500).json({ error: 'Failed to add car' });
        });
};

//---------------------
//----EDIT CAR-----
//---------------------
const editCar = async (req, res, next) => {
    const carId = req.params.id;

    try {
        // Fetch current car from DB
        const existingCar = await carModel.getCarById(carId);
        if (!existingCar) {
            return res.status(404).json({ error: 'Car not found' });
        }

        let imageUrl = existingCar.image_url;

        // If a new image is uploaded, update path and remove the old file
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;

            const oldImagePath = path.join(__dirname, '..', 'public', existingCar.image_url);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.warn('⚠️ Failed to delete old image:', err);
            });
        }

        const updatedData = {
            ...req.body,
            image_url: imageUrl,
            price_per_day: parseInt(req.body.price_per_day),
            available: parseInt(req.body.available)
        };

        const response = await carModel.editCar(carId, updatedData);
        res.status(200).json(response);
    } catch (err) {
        console.error('Error updating car:', err);
        res.status(500).json({ error: 'Failed to update car' });
    }
};

const deleteCar = (req, res, next) => {
    const carId = req.params.id

    carModel.deleteCar(carId)
        .then(response => res.status(200).json(response))
        .catch(err => {
            console.error('Error deleting car:', err)
            res.status(500).json({ error: 'Failed to delete car' })
        })
}

const getAvailableCars = (req, res) => {
    carModel.getAvailableCars()
        .then(results => res.status(200).json(results))
        .catch(err => {
            console.error('Error fetching available cars:', err);
            res.status(500).json({ error: 'Failed to retrieve cars' });
        });
};


const refreshCarAvailability = async (req, res) => {
    try {
        const result = await carModel.refreshAvailability();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error refreshing availability:', err);
        res.status(500).json({ error: 'Failed to refresh availability' });
    }
};

module.exports = {
    getAllCars,
    getCarById,
    addCar,
    editCar,
    deleteCar,
    getAvailableCars,
    refreshCarAvailability,
}