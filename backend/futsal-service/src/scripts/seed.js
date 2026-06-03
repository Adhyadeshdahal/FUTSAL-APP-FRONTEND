const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const pool = require('../db');

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const schemaPath = path.join(__dirname, '../../sql/schema.sql');
const futsalPath = path.join(__dirname, '../futsalfile.json');
const timingsDir = path.join(__dirname, '../Timings');
const bookingsPath = path.join(__dirname, '../bookings.json');
const databaseName = process.env.MYSQL_DATABASE || 'myfutsal';

function priceToNumber(price) {
  const match = String(price || '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

async function runStatements(connection, sql) {
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await connection.query(statement);
  }
}

async function seed() {
  const serverConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  });

  await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await serverConnection.end();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await runStatements(connection, fs.readFileSync(schemaPath, 'utf8'));

    const futsals = JSON.parse(fs.readFileSync(futsalPath, 'utf8'));

    for (const futsal of futsals) {
      const imageUrl = futsal.image_url || futsal.imageurl || null;
      await connection.execute(
        `INSERT INTO futsals
          (id, name, location, phone_number, price_per_hour, price_label, rating, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          location = VALUES(location),
          phone_number = VALUES(phone_number),
          price_per_hour = VALUES(price_per_hour),
          price_label = VALUES(price_label),
          rating = VALUES(rating),
          image_url = VALUES(image_url)`,
        [
          Number(futsal.id),
          futsal.name,
          futsal.location,
          futsal.phone_number,
          priceToNumber(futsal.price),
          futsal.price,
          futsal.rating || null,
          imageUrl,
        ],
      );
    }

    const timingFiles = fs
      .readdirSync(timingsDir)
      .filter((file) => file.endsWith('.json'));

    for (const file of timingFiles) {
      const futsalId = Number(path.basename(file, '.json'));
      const timingData = JSON.parse(fs.readFileSync(path.join(timingsDir, file), 'utf8'));

      for (const [slotDate, slots] of Object.entries(timingData)) {
        for (const [timing, available] of Object.entries(slots)) {
          await connection.execute(
            `INSERT INTO futsal_time_slots (futsal_id, slot_date, timing, available)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE available = VALUES(available)`,
            [futsalId, slotDate, timing, Boolean(available)],
          );
        }
      }
    }

    if (fs.existsSync(bookingsPath)) {
      const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));

      for (const booking of bookings) {
        await connection.execute(
          `INSERT IGNORE INTO bookings (booking_id, user_id, futsal_id, slot_date, timing)
          VALUES (?, ?, ?, ?, ?)`,
          [
            Number(booking.bookingId),
            booking.userId,
            Number(booking.futsalId),
            booking.date,
            booking.timing,
          ],
        );

        await connection.execute(
          `UPDATE futsal_time_slots
          SET available = false
          WHERE futsal_id = ? AND slot_date = ? AND timing = ?`,
          [Number(booking.futsalId), booking.date, booking.timing],
        );
      }
    }

    await connection.commit();
    console.log('MySQL schema and seed data are ready.');
  } catch (error) {
    await connection.rollback();
    console.error('Failed to seed MySQL data:', error);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

seed();
