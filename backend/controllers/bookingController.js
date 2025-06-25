const bookingModel = require('../models/bookingModel'); // Booking DB operations
const db = require('../services/database').config; // DB connection
const carModel = require('../models/carsModel'); // Car DB operations

/**
 * Create a new booking:
 * - Validates inputs
 * - Checks if car exists and is available
 * - Calculates duration and total price
 * - Saves the booking to the DB
 * - Marks the car as unavailable
 */
const createBooking = async (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT
    const { car_id, start_date, end_date } = req.body;

    // Validate that all required fields are present
    if (!car_id || !start_date || !end_date) {
        return res.status(400).json({ error: 'Missing booking data' });
    }

    try {
        // Step 1: Check if the car exists and is available
        const carQuery = 'SELECT price_per_day, available FROM CCL2_cars WHERE car_id = ?';
        const [carResult] = await db.promise().query(carQuery, [car_id]);

        if (carResult.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const { price_per_day, available } = carResult[0];

        if (available === 0) {
            return res.status(400).json({ error: 'Car is not available for booking' });
        }

        // Step 2: Calculate number of booking days
        const start = new Date(start_date);
        const end = new Date(end_date);
        const timeDiff = end - start;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days

        if (days <= 0) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        const totalPrice = price_per_day * days;

        // Step 3: Save booking to DB
        const result = await bookingModel.createBooking({
            user_id: userId,
            car_id,
            start_date,
            end_date,
            total_price: totalPrice
        });

        // Step 4: Set car as unavailable after booking
        const updateAvailabilityQuery = 'UPDATE CCL2_cars SET available = 0 WHERE car_id = ?';
        await db.promise().query(updateAvailabilityQuery, [car_id]);

        res.status(201).json(result); // Respond with booking info
    } catch (err) {
        console.error('Booking creation failed:', err);
        res.status(500).json({ error: 'Booking failed' });
    }
};

/**
 * Get all bookings made by the logged-in user
 */
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from JWT

        const bookings = await bookingModel.getBookingsByUser(userId);

        res.status(200).json(bookings); // Return user's bookings
    } catch (err) {
        console.error('Error fetching user bookings:', err);
        res.status(500).json({ error: 'Could not retrieve bookings' });
    }
};

/**
 * Cancel a booking:
 * - Only allowed by the booking's owner
 * - Deletes the booking
 * - Sets the car as available again
 */
const deleteBooking = async (req, res) => {
    const bookingId = req.params.id; // Booking to delete
    const userId = req.user.id; // Authenticated user

    try {
        const booking = await bookingModel.getBookingById(bookingId);

        // Block unauthorized deletion
        if (!booking || booking.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized or booking not found' });
        }

        // Delete the booking
        await bookingModel.deleteBooking(bookingId);

        // Mark the car as available again
        await carModel.setCarAvailability(booking.car_id, 1); // 1 = available
        console.log('Resetting availability for car ID:', booking.car_id);

        res.status(200).json({ message: 'Booking cancelled', bookingId });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Cancellation failed' });
    }
};

/**
 * Admin route to get all bookings in the system
 */
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.getAllBookings(); // Includes car + user info
        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({ error: 'Failed to retrieve bookings' });
    }
};

// Export controller functions
module.exports = {
    createBooking,
    getMyBookings,
    deleteBooking,
    getAllBookings
};