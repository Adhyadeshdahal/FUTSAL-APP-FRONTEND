const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const Bookings = require('./bookings');
const { toFutsalResponse, formatDate } = require('./futsalMapper');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.FUTSAL_SERVICE_PORT || process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'futsal-service' });
  } catch (error) {
    res.status(500).json({ status: 'error', service: 'futsal-service' });
  }
});

app.get('/searchByName/:name', async (req, res) => {
  try {
    const search = `%${req.params.name.toLowerCase().replace(/\s/g, '')}%`;
    const orderBy = getOrderBy(req.query.sort);

    const [rows] = await pool.execute(
      `SELECT *
      FROM futsals
      WHERE LOWER(REPLACE(name, ' ', '')) LIKE ?
      ${orderBy}`,
      [search],
    );

    res.json(rows.map((row) => toFutsalResponse(row)));
  } catch (error) {
    console.error('Error searching futsals by name:', error);
    res.status(500).json({ error: 'Failed to search futsals' });
  }
});

app.get('/searchByDate/:date', async (req, res) => {
  try {
    const date = req.params.date.replace(/^"|"$/g, '');
    const orderBy = getOrderBy(req.query.sort);

    const [rows] = await pool.execute(
      `SELECT DISTINCT f.*
      FROM futsals f
      INNER JOIN futsal_time_slots s ON s.futsal_id = f.id
      WHERE s.slot_date = ? AND s.available = true
      ${orderBy}`,
      [date],
    );

    res.json(rows.map((row) => toFutsalResponse(row, [date])));
  } catch (error) {
    console.error('Error searching futsals by date:', error);
    res.status(500).json({ error: 'Failed to search futsals' });
  }
});

app.use('/Bookings', Bookings);

app.get('/futsals', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM futsals ORDER BY name ASC');
    res.json(rows.map((row) => toFutsalResponse(row)));
  } catch (error) {
    console.error('Error fetching futsals:', error);
    res.status(500).json({ error: 'Failed to fetch futsals' });
  }
});

app.get('/futsals/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM futsals WHERE id = ?',
      [Number(req.params.id)],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Futsal not found' });
    }

    const [dateRows] = await pool.execute(
      `SELECT DISTINCT DATE_FORMAT(slot_date, '%Y-%m-%d') AS date
      FROM futsal_time_slots
      WHERE futsal_id = ?
      ORDER BY slot_date ASC`,
      [Number(req.params.id)],
    );

    res.json(toFutsalResponse(rows[0], dateRows.map((row) => formatDate(row.date))));
  } catch (error) {
    console.error('Error fetching futsal:', error);
    res.status(500).json({ error: 'Failed to fetch futsal' });
  }
});

app.get('/futsals/Timings/:futsalId/:date', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT timing
      FROM futsal_time_slots
      WHERE futsal_id = ? AND slot_date = ? AND available = true
      ORDER BY timing ASC`,
      [Number(req.params.futsalId), req.params.date],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Date not found or no slots available' });
    }

    res.json({ availableTimings: rows.map((row) => row.timing) });
  } catch (error) {
    console.error('Error fetching timings:', error);
    res.status(500).json({ error: 'Failed to fetch timings' });
  }
});

function getOrderBy(sort) {
  const sortField = String(sort || '').toLowerCase();

  if (sortField === 'name') return 'ORDER BY name ASC';
  if (sortField === 'price') return 'ORDER BY price_per_hour ASC';

  return 'ORDER BY name ASC';
}

app.listen(PORT, () => {
  console.log(`Futsal service running on port ${PORT}`);
});
