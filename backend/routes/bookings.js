const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authService = require('../services/authentication');

// Protect all booking routes with JWT authentication
router.use(authService.authenticateJWT);

// POST /bookings → Create a new booking
// Requires: user must be authenticated and must provide car_id, start_date, and end_date in the request body
router.post('/', bookingController.createBooking);

// DELETE /bookings/:id → Cancel a booking
// Requires: user must be authenticated and own the booking
router.delete('/:id', authService.authenticateJWT, bookingController.deleteBooking);

// GET /bookings/mybookings → Get all bookings made by the currently logged-in user
router.get('/mybookings', bookingController.getMyBookings);

// GET /bookings/admin → Admin-only view of all bookings
// Requires: user must be authenticated and have admin role
router.get(
    '/admin',
    (req, res, next) => {
        console.log('/bookings/admin route accessed');
        next();
    },
    authService.authenticateJWT,
    authService.isAdmin,
    bookingController.getAllBookings
);

// Export the booking routes
module.exports = router;