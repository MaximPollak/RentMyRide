const db = require('../services/database').config; // Import the database connection

/**
 * Create a new booking in the database with "Pending" status.
 * @param {Object} bookingData - Booking details: user_id, car_id, start_date, end_date, total_price
 * @returns {Promise<Object>} - Confirmation with new booking ID
 */
const createBooking = ({ user_id, car_id, start_date, end_date, total_price }) => {
    const sql = `
        INSERT INTO CCL2_bookings (user_id, car_id, start_date, end_date, total_price, status)
        VALUES (?, ?, ?, ?, ?, 'Pending') -- Default status is Pending
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [user_id, car_id, start_date, end_date, total_price], (err, result) => {
            if (err) return reject(err); // Insert failed
            resolve({ message: 'Booking created successfully', booking_id: result.insertId });
        });
    });
};

/**
 * Get all bookings made by a specific user, including car details.
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} - List of bookings with car info
 */
const getBookingsByUser = (userId) => {
    const sql = `
        SELECT b.*,
               c.brand, c.model, c.category, c.price_per_day, c.image_url
        FROM CCL2_bookings b
        JOIN CCL2_cars c ON b.car_id = c.car_id
        WHERE b.user_id = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [userId], (err, results) => {
            if (err) return reject(err); // Query failed
            resolve(results); // Return booking list with car details
        });
    });
};

/**
 * Get a single booking by its ID.
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} - Booking object (or undefined)
 */
const getBookingById = (bookingId) => {
    const sql = 'SELECT * FROM CCL2_bookings WHERE booking_id = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [bookingId], (err, results) => {
            if (err) return reject(err); // Query failed
            resolve(results[0]); // Return the first match (or undefined)
        });
    });
};

/**
 * Delete a booking by its ID.
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} - Confirmation message
 */
const deleteBooking = (bookingId) => {
    const sql = 'DELETE FROM CCL2_bookings WHERE booking_id = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [bookingId], (err, result) => {
            if (err) return reject(err); // Deletion failed
            resolve({ message: 'Booking deleted', bookingId }); // Success message
        });
    });
};

/**
 * Get all bookings across the platform (admin view),
 * including user and car details, ordered by start date.
 * @returns {Promise<Array>} - List of all bookings
 */
const getAllBookings = () => {
    const sql = `
        SELECT b.booking_id, b.user_id, b.car_id, b.start_date, b.end_date, b.total_price,
               u.username, u.email,
               c.brand, c.model, c.image_url
        FROM CCL2_bookings b
                 JOIN CCL2_users u ON b.user_id = u.user_id
                 JOIN CCL2_cars c ON b.car_id = c.car_id
        ORDER BY b.start_date DESC -- Most recent bookings first
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) return reject(err); // Query failed
            resolve(results); // Return full booking list
        });
    });
};

// Export all booking-related functions
module.exports = {
    createBooking,
    getBookingsByUser,
    getBookingById,
    deleteBooking,
    getAllBookings,
};