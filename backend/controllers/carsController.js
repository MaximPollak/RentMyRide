const carModel = require('../models/carsModel');

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
const editCar = (req, res, next) => {
    const carId = req.params.id;
    // If a new image was uploaded, use it; otherwise keep existing one
    const updatedData = {
        ...req.body,
        image_url: req.file ? `/uploads/${req.file.filename}` : req.body.image_url
    };
    // Ensure number fields are parsed (optional but cleaner)
    updatedData.price_per_day = parseInt(updatedData.price_per_day);
    updatedData.available = parseInt(updatedData.available);

    carModel.editCar(carId, updatedData)
        .then(response => res.status(200).json(response))
        .catch(err => {
            console.error('Error updating car:', err);
            res.status(500).json({ error: 'Failed to update car' });
        });
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