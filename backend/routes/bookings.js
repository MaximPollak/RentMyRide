const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authService = require('../services/authentication');

// 🔐 Protect all booking routes
router.use(authService.authenticateJWT);

// POST /bookings → create a new booking
router.post('/', bookingController.createBooking);

router.delete('/:id', authService.authenticateJWT, bookingController.deleteBooking);

// GET /bookings/me → get current user's bookings
router.get('/mybookings', bookingController.getMyBookings);

module.exports = router;