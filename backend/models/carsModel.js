const db = require('../services/database').config; // Import the database connection

/**
 * Fetch all cars from the database.
 * Before returning, it also updates car availability:
 * - Any car with a booking that ended before today (end_date < CURDATE())
 *   will be marked as available again (available = 1).
 */
const getAllCars = async () => {
    try {
        // Step 1: Set available = 1 for cars whose booking has ended
        const updateQuery = `
            UPDATE CCL2_cars
            SET available = 1
            WHERE car_id IN (
                SELECT car_id FROM CCL2_bookings
                WHERE end_date < CURDATE()
            )
        `;
        await db.promise().query(updateQuery); // Run the update

        // Step 2: Fetch all cars from the cars table
        const [cars] = await db.promise().query('SELECT * FROM CCL2_cars');
        return cars;
    } catch (err) {
        throw err; // Let the caller handle the error
    }
};

/**
 * Fetch a single car by ID
 * @param {number} id - The ID of the car
 * @returns {Promise<Object|null>} Resolves with car object or null if not found
 */
const getCarById = (id) => {
    const sql = 'SELECT * FROM CCL2_cars WHERE car_id = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, results) => {
            if (err) return reject(err); // Error in query
            if (results.length === 0) return resolve(null); // No car found
            resolve(results[0]); // Return the found car
        });
    });
};

/**
 * Insert a new car into the database
 * @param {Object} carData - Car details from the request
 * @returns {Promise<Object>} The inserted car with new ID
 */
const addCar = (carData) => {
    const sql = `
        INSERT INTO CCL2_cars (brand, model, category, info, price_per_day, image_url, available)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        carData.brand,
        carData.model,
        carData.category,
        carData.info,
        carData.price_per_day,
        carData.image_url,
        carData.available
    ];

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) return reject(err); // Insert failed
            resolve({ id: result.insertId, ...carData }); // Return new car with generated ID
        });
    });
};

/**
 * Update an existing car's data
 * @param {number} id - Car ID
 * @param {Object} carData - Updated car fields
 * @returns {Promise<Object>} Confirmation message
 */
const editCar = (id, carData) => {
    const sql = `
        UPDATE CCL2_cars
        SET brand = ?, model = ?, category = ?, info = ?, price_per_day = ?, image_url = ?, available = ?
        WHERE car_id = ?
    `;

    const values = [
        carData.brand,
        carData.model,
        carData.category,
        carData.info,
        carData.price_per_day,
        carData.image_url,
        carData.available,
        id
    ];

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) return reject(err); // Update failed
            resolve({ message: 'Car updated', id }); // Acknowledge success
        });
    });
};

/**
 * Delete a car by ID
 * @param {number} id - Car ID to delete
 * @returns {Promise<Object>} Confirmation message
 */
const deleteCar = (id) => {
    const sql = 'DELETE FROM CCL2_cars WHERE car_id = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err); // Deletion failed
            resolve({ message: 'Car deleted', id }); // Acknowledge success
        });
    });
};

/**
 * Fetch all cars that are marked as available
 * @returns {Promise<Array>} Array of available cars
 */
const getAvailableCars = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM CCL2_cars WHERE available = 1';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching available cars:', err);
                return reject(err); // Query failed
            }
            resolve(results); // Return array of available cars
        });
    });
};

/**
 * Refresh availability manually (same logic as in getAllCars)
 * Marks cars available if their booking ended before today
 * @returns {Promise<Object>} Confirmation message
 */
const refreshAvailability = () => {
    const sql = `
        UPDATE CCL2_cars
        SET available = 1
        WHERE car_id IN (
            SELECT car_id FROM CCL2_bookings
            WHERE end_date < CURDATE()
        )
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) return reject(err); // Update failed
            resolve({ message: 'Car availability refreshed', result }); // Success message
        });
    });
};

// Export all car-related functions to be used in routes/controllers
module.exports = {
    getAllCars,
    getCarById,
    addCar,
    editCar,
    deleteCar,
    getAvailableCars,
    refreshAvailability,
};