const db = require('../services/database').config

/**
 * Fetch all cars from the database.
 * Before returning, it also updates car availability:
 * - Any car with a booking that ended before today (end_date < CURDATE())
 *   will be marked as available again (available = 1).
 *
 * This ensures that cars automatically become available
 * again after their booking period ends.
 *
 * @returns {Promise<Array>} Resolves with an array of car objects.
 */
const getAllCars = async () => {
    try {
        // Reset availability for cars whose bookings have ended
        const updateQuery = `
            UPDATE CCL2_cars
            SET available = 1
            WHERE car_id IN (
                SELECT car_id FROM CCL2_bookings
                WHERE end_date < CURDATE()
            )
        `;
        await db.promise().query(updateQuery);

        // Return all cars
        const [cars] = await db.promise().query('SELECT * FROM CCL2_cars');
        return cars;
    } catch (err) {
        throw err;
    }
};

const getCarById = (id) => {
    const sql = 'SELECT * FROM CCL2_cars WHERE car_id = ?'

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, results) => {
            console.log('Looking for car ID:', id)
            if (err) return reject(err)
            if (results.length === 0) return resolve(null)
            resolve(results[0]) // only one car expected
        })
    })
}

const addCar = (carData) => {
    const sql = `
        INSERT INTO CCL2_cars (brand, model, category, info, price_per_day, image_url, available)
        VALUES (?, ?, ?, ?, ?, ?, ?)`

    const values = [
        carData.brand,
        carData.model,
        carData.category,
        carData.info,
        carData.price_per_day,
        carData.image_url,
        carData.available
    ]

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) return reject(err)
            resolve({ id: result.insertId, ...carData })
        })
    })
}

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
            if (err) return reject(err);
            resolve({ message: 'Car updated', id: id });
        });
    });
};

const deleteCar = (id) => {
    const sql = 'DELETE FROM CCL2_cars WHERE car_id = ?'

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err)
            resolve({ message: 'Car deleted', id })
        })
    })
}

/**
 * Set a car's availability status.
 * @param {number} carId
 * @param {number} available - 1 (available) or 0 (unavailable)
 * @returns {Promise<object>}
 */
const setCarAvailability = (carId, available) => {
    const sql = 'UPDATE CCL2_cars SET available = ? WHERE car_id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [available, carId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


const getAvailableCars = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM CCL2_cars WHERE available = 1';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching available cars:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    getAllCars,
    getCarById,
    addCar,
    editCar,
    deleteCar,
    setCarAvailability,
    getAvailableCars,
}
