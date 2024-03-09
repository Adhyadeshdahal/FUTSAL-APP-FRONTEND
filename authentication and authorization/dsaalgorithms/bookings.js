const fs = require('fs');
const {makeTimingUnavailable,makeTimingAvailable}= require('./timings_rw.js');
const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/auth');

// Load futsal data from JSON file
const futsalFilePath = path.join(__dirname, 'futsalfile.json');
const bookingsFilePath = path.join(__dirname, 'bookings.json');

const futsalData = JSON.parse(fs.readFileSync(futsalFilePath, 'utf8'));


// Function to generate a random 5-digit booking ID
function generateRandomBookingId() {
    return Math.floor(10000 + Math.random() * 90000);
}

// Function to retrieve booking details for a user
function getMyBookings(userId) {
    // Read booking data from a JSON file (replace bookingsFilePath with your actual file path)
    try {
        bookingsData = JSON.parse(fs.readFileSync(bookingsFilePath, 'utf8'));
    } catch (error) {
        // Handle file read error, e.g., file does not exist
        console.error('Error reading bookings file:', error);
        return;
    }

    // Filter bookings for the given user ID
    const userBookings = bookingsData.filter(booking => booking.userId === userId);

    // Return the filtered bookings
    return userBookings;
}

function postMyBookings(userId, futsalId, date, timing) {
    // Read existing booking data from bookings.json
    let bookingsData = [];
    try {
        bookingsData = JSON.parse(fs.readFileSync(bookingsFilePath, 'utf8'));
    } catch (error) {
        // Handle file read error, e.g., file does not exist
        console.error('Error reading bookings file:', error);
        return;
    }

    // Generate a random booking ID
    const bookingId = generateRandomBookingId();

    // Create a new booking object
    const newBooking = {
        bookingId: bookingId,
        userId: userId,
        futsalId: futsalId,
        date: date,
        timing: timing
    };

    // Add the new booking to the existing data
    bookingsData.push(newBooking);

    // Write the updated data back to bookings.json
    try {
        makeTimingUnavailable(futsalId, date, timing);
        // Write the updated data back to bookings.json
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookingsData, null, 2));
    } catch (error) {
        console.error('Error writing to bookings file:', error);
        return;
    }

    // Return the new booking ID
    return bookingId;
}


function deleteBooking(bookingId) {
    // Read existing booking data from bookings.json
    let bookingsData = [];
    try {
        bookingsData = JSON.parse(fs.readFileSync(bookingsFilePath, 'utf8'));
    } catch (error) {
        // Handle file read error, e.g., file does not exist
        console.error('Error reading bookings file:', error);
        return false;
    }

    // Find the index of the booking with the specified bookingId
    const bookingIndex = bookingsData.findIndex(booking => booking.bookingId === bookingId);

    // If the booking is found, remove it from the array
    if (bookingIndex !== -1) {
        const { futsalId, date, timing } = bookingsData[bookingIndex];
        makeTimingAvailable(futsalId, date, timing);
        bookingsData.splice(bookingIndex, 1);

        // Write the updated data back to bookings.json
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookingsData, null, 2));
        return true;
    }

    return bookingIndex; // Booking not found
}

// Define a route to handle GET requests for retrieving bookings
router.get('/mybookings', auth, (req, res) => {
    const userId = req.user._id; // Assuming userId is stored in req.user
    const bookings = getMyBookings(userId);
    const updatedBookings = bookings.map(booking => {
        // Find the futsal corresponding to the booking's futsalId
        const futsal = futsalData.find(f => f.id === booking.futsalId);
        // If futsal is found, update the futsalId with futsalName
        if (futsal) {
            booking.futsalName = futsal.name;
        }
        return booking;
    })
    res.json(updatedBookings);
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
    let bookingId = req.params.bookingId;
    console.log(bookingId);
    // Check if bookingId is a valid number
    if (isNaN(bookingId)) {
        return res.status(400).json({ error: 'Invalid bookingId' });
    }

    const success = deleteBooking(parseInt(bookingId));

    if (success) {
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Booking not found' });
    }
});

module.exports=router;