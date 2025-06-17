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

router.get(
    '/admin',
    (req, res, next) => {
        console.log('📡 /bookings/admin route hit');
        next(); // pass control to the next middleware
    },
    authService.authenticateJWT,
    authService.isAdmin,
    bookingController.getAllBookings
);

module.exports = router;