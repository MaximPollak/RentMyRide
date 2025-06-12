const bookingModel = require('../models/bookingModel');
const db = require('../services/database').config;
const carModel = require('../models/carsModel');

/**
 * Controller to handle new bookings
 */
const createBooking = async (req, res) => {
    const userId = req.user.id; // From JWT token
    const { car_id, start_date, end_date } = req.body;

    // Validate required fields
    if (!car_id || !start_date || !end_date) {
        return res.status(400).json({ error: 'Missing booking data' });
    }

    try {
        // 1. Check car availability + get price
        const carQuery = 'SELECT price_per_day, available FROM CCL2_cars WHERE car_id = ?';
        const [carResult] = await db.promise().query(carQuery, [car_id]);

        if (carResult.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const { price_per_day, available } = carResult[0];

        if (available === 0) {
            return res.status(400).json({ error: 'Car is not available for booking' });
        }

        // 2. Calculate number of days
        const start = new Date(start_date);
        const end = new Date(end_date);
        const timeDiff = end - start;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        const totalPrice = price_per_day * days;

        // 3. Save booking
        const result = await bookingModel.createBooking({
            user_id: userId,
            car_id,
            start_date,
            end_date,
            total_price: totalPrice
        });

        // 4. Mark car as unavailable
        const updateAvailabilityQuery = 'UPDATE CCL2_cars SET available = 0 WHERE car_id = ?';
        await db.promise().query(updateAvailabilityQuery, [car_id]);

        res.status(201).json(result);
    } catch (err) {
        console.error('Booking creation failed:', err);
        res.status(500).json({ error: 'Booking failed' });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id; // 🔐 from JWT

        const bookings = await bookingModel.getBookingsByUser(userId);

        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching user bookings:', err);
        res.status(500).json({ error: 'Could not retrieve bookings' });
    }
};


/**
 * Cancel a booking by ID.
 * Only the user who owns the booking can cancel it.
 */
const deleteBooking = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    try {
        const booking = await bookingModel.getBookingById(bookingId);

        // Booking not found or doesn't belong to user
        if (!booking || booking.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized or booking not found' });
        }

        // Delete booking
        await bookingModel.deleteBooking(bookingId);

        // Set car availability back to 1
        await carModel.setCarAvailability(booking.car_id, 1);
        console.log('Resetting availability for car ID:', booking.car_id);

        res.status(200).json({ message: 'Booking cancelled', bookingId });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Cancellation failed' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    deleteBooking,
};