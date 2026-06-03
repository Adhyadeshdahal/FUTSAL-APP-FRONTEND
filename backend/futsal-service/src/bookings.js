const express = require('express');
const pool = require('./db');
const auth = require('../../auth-service/src/middleware/auth');
const { formatDate } = require('./futsalMapper');

const router = express.Router();

router.get('/mybookings', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        b.booking_id AS bookingId,
        b.user_id AS userId,
        b.futsal_id AS futsalId,
        DATE_FORMAT(b.slot_date, '%Y-%m-%d') AS date,
        b.timing,
        f.name AS futsalName
      FROM bookings b
      INNER JOIN futsals f ON f.id = b.futsal_id
      WHERE b.user_id = ?
      ORDER BY b.slot_date ASC, b.timing ASC`,
      [req.user._id],
    );

    res.json(rows.map((booking) => ({
      ...booking,
      futsalId: String(booking.futsalId),
      date: formatDate(booking.date),
    })));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/mybookings', auth, async (req, res) => {
  const { futsalId, date, timing } = req.body;

  if (!futsalId || !date || !timing) {
    return res.status(400).json({ error: 'futsalId, date, and timing are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [slots] = await connection.execute(
      `SELECT id, available
      FROM futsal_time_slots
      WHERE futsal_id = ? AND slot_date = ? AND timing = ?
      FOR UPDATE`,
      [Number(futsalId), date, timing],
    );

    if (slots.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Time slot not found' });
    }

    if (!slots[0].available) {
      await connection.rollback();
      return res.status(409).json({ error: 'Time slot is already booked' });
    }

    const [result] = await connection.execute(
      `INSERT INTO bookings (user_id, futsal_id, slot_date, timing)
      VALUES (?, ?, ?, ?)`,
      [req.user._id, Number(futsalId), date, timing],
    );

    await connection.execute(
      `UPDATE futsal_time_slots
      SET available = false
      WHERE id = ?`,
      [slots[0].id],
    );

    await connection.commit();
    res.status(201).json({ bookingId: result.insertId });
  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Time slot is already booked' });
    }

    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    connection.release();
  }
});

router.delete('/mybookings/:bookingId', auth, async (req, res) => {
  const bookingId = Number(req.params.bookingId);

  if (!Number.isInteger(bookingId)) {
    return res.status(400).json({ error: 'Invalid bookingId' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [bookings] = await connection.execute(
      `SELECT booking_id, futsal_id, DATE_FORMAT(slot_date, '%Y-%m-%d') AS slotDate, timing
      FROM bookings
      WHERE booking_id = ? AND user_id = ?
      FOR UPDATE`,
      [bookingId, req.user._id],
    );

    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[0];

    await connection.execute(
      `DELETE FROM bookings
      WHERE booking_id = ? AND user_id = ?`,
      [bookingId, req.user._id],
    );

    await connection.execute(
      `UPDATE futsal_time_slots
      SET available = true
      WHERE futsal_id = ? AND slot_date = ? AND timing = ?`,
      [booking.futsal_id, booking.slotDate, booking.timing],
    );

    await connection.commit();
    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  } finally {
    connection.release();
  }
});

module.exports = router;
