const { generateRandomBookingId, getMyBookings, postMyBookings, deleteBooking } = require('../bookings.js');
const fs = require('fs');
const {makeTimingUnavailable,makeTimingAvailable}= require('../timings_rw.js');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Define a route to handle GET requests for retrieving bookings
router.get('/mybookings', auth, (req, res) => {
    const userId = req.user._id; // Assuming userId is stored in req.user
    const bookings = getMyBookings(userId);
    res.json(bookings);
});

// Define a route to handle POST requests for creating bookings
router.post('/mybookings', auth, (req, res) => {
    const userId = req.user._id; // Assuming userId is stored in req.user
    const { futsalId, date, timing } = req.body;
    const bookingId = postMyBookings(userId, futsalId, date, timing);
    res.json({ bookingId });
});

// Define a route to handle DELETE requests for deleting bookings
router.delete('/mybookings/:bookingId', auth, (req, res) => {
    const userId = req.user._id; // Assuming userId is stored in req.user
    const bookingId = req.params.bookingId;
    const success = deleteBooking(bookingId);
    res.json({ success });
});
module.exports=router;