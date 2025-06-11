const express = require('express')
const router = express.Router()

// GET /
router.get('/', (req, res) => {
    res.send('Welcome to RentMyRide API 🚗')
})

module.exports = router