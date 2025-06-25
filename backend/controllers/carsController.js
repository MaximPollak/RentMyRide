const carModel = require('../models/carsModel'); // Handles DB queries related to cars
const fs = require('fs'); // For file system operations (deleting old image)
const path = require('path'); // To build correct file paths

//---------------------------
// 🚗 GET ALL CARS
//---------------------------
const getAllCars = (req, res, next) => {
    carModel.getAllCars()
        .then(cars => res.status(200).json(cars)) // Return list of cars
        .catch(err => res.status(401).json(err)); // Could include DB or logic error
};

//---------------------------
// 🔍 GET CAR BY ID
//---------------------------
const getCarById = (req, res, next) => {
    const carId = req.params.id;

    carModel.getCarById(carId)
        .then(car => {
            if (!car) return res.status(404).json({ error: 'Car not found' }); // Not found
            res.status(200).json(car); // Return single car object
        })
        .catch(err => {
            console.error('Error fetching car:', err);
            res.status(500).json({ error: 'Failed to fetch car' }); // Server error
        });
};

//---------------------------
// ➕ ADD A NEW CAR
//---------------------------
const addCar = (req, res, next) => {
    // Image upload is required
    if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
    }

    // Construct path to store in DB (e.g. "/uploads/car.jpg")
    const imageUrl = `/uploads/${req.file.filename}`;

    // Combine form data + image URL
    const carData = {
        ...req.body,
        image_url: imageUrl,
        available: 1 // New cars are available by default
    };

    console.log('🚗 carData to insert:', carData);
    console.log('Received file:', req.file);
    console.log('Received body:', req.body);

    carModel.addCar(carData)
        .then(newCar => res.status(201).json(newCar)) // Return new car
        .catch(err => {
            console.error('Error adding car:', err);
            res.status(500).json({ error: 'Failed to add car' }); // Insert error
        });
};

//---------------------------
// ✏️ EDIT CAR
//---------------------------
const editCar = async (req, res, next) => {
    const carId = req.params.id;

    try {
        // Fetch existing car to check if it exists and to get current image path
        const existingCar = await carModel.getCarById(carId);
        if (!existingCar) {
            return res.status(404).json({ error: 'Car not found' });
        }

        let imageUrl = existingCar.image_url; // Default to existing image

        // If a new image was uploaded:
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // New image path

            // Remove the old image file from the server
            const oldImagePath = path.join(__dirname, '..', 'public', existingCar.image_url);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.warn('⚠️ Failed to delete old image:', err);
            });
        }

        // Format incoming data (ensure price and availability are numbers)
        const updatedData = {
            ...req.body,
            image_url: imageUrl,
            price_per_day: parseInt(req.body.price_per_day),
            available: parseInt(req.body.available)
        };

        // Update car in DB
        const response = await carModel.editCar(carId, updatedData);
        res.status(200).json(response); // Success response
    } catch (err) {
        console.error('Error updating car:', err);
        res.status(500).json({ error: 'Failed to update car' }); // DB or logic error
    }
};

//---------------------------
// ❌ DELETE CAR
//---------------------------
const deleteCar = (req, res, next) => {
    const carId = req.params.id;

    carModel.deleteCar(carId)
        .then(response => res.status(200).json(response)) // Car deleted
        .catch(err => {
            console.error('Error deleting car:', err);
            res.status(500).json({ error: 'Failed to delete car' }); // Deletion failed
        });
};

//---------------------------
// ✅ GET AVAILABLE CARS ONLY
//---------------------------
const getAvailableCars = (req, res) => {
    carModel.getAvailableCars()
        .then(results => res.status(200).json(results)) // Only cars with available = 1
        .catch(err => {
            console.error('Error fetching available cars:', err);
            res.status(500).json({ error: 'Failed to retrieve cars' });
        });
};

//---------------------------
// 🔄 REFRESH CAR AVAILABILITY
// Used after a booking ends
//---------------------------
const refreshCarAvailability = async (req, res) => {
    try {
        const result = await carModel.refreshAvailability(); // Update all expired bookings
        res.status(200).json(result);
    } catch (err) {
        console.error('Error refreshing availability:', err);
        res.status(500).json({ error: 'Failed to refresh availability' });
    }
};

// Export all car controller functions
module.exports = {
    getAllCars,
    getCarById,
    addCar,
    editCar,
    deleteCar,
    getAvailableCars,
    refreshCarAvailability,
};