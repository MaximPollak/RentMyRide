const db = require('../services/database').config;

/**
 * Create a new booking and save it to the database
 */
const createBooking = ({ user_id, car_id, start_date, end_date, total_price }) => {
    const sql = `
        INSERT INTO CCL2_bookings (user_id, car_id, start_date, end_date, total_price, status)
        VALUES (?, ?, ?, ?, ?, 'Pending')
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [user_id, car_id, start_date, end_date, total_price], (err, result) => {
            if (err) return reject(err);
            resolve({ message: 'Booking created successfully', booking_id: result.insertId });
        });
    });
};

const getBookingsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT b.*,
                            c.brand, c.model, c.category, c.price_per_day, c.image_url
                     FROM CCL2_bookings b
                              JOIN CCL2_cars c ON b.car_id = c.car_id
                     WHERE b.user_id = ?
        `;
        db.query(sql, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Fetch a booking by its ID.
 * @param {number} bookingId
 * @returns {Promise<object>}
 */
const getBookingById = (bookingId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM CCL2_bookings WHERE booking_id = ?';
        db.query(sql, [bookingId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Return first result (or undefined)
        });
    });
};

/**
 * Delete a booking by ID.
 * @param {number} bookingId
 * @returns {Promise<object>}
 */
const deleteBooking = (bookingId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM CCL2_bookings WHERE booking_id = ?';
        db.query(sql, [bookingId], (err, result) => {
            if (err) return reject(err);
            resolve({ message: 'Booking deleted', bookingId });
        });
    });
};

const getAllBookings = () => {
    const sql = `
        SELECT b.booking_id, b.user_id, b.car_id, b.start_date, b.end_date, b.total_price,
               u.username, u.email,
               c.brand, c.model, c.image_url
        FROM CCL2_bookings b
                 JOIN CCL2_users u ON b.user_id = u.user_id
                 JOIN CCL2_cars c ON b.car_id = c.car_id
        ORDER BY b.start_date DESC
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    createBooking,
    getBookingsByUser,
    getBookingById,
    deleteBooking,
    getAllBookings,
};