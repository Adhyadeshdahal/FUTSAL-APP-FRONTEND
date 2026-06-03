CREATE TABLE IF NOT EXISTS futsals (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  price_per_hour DECIMAL(10, 2) NOT NULL,
  price_label VARCHAR(100),
  rating DECIMAL(2, 1) DEFAULT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS futsal_time_slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  futsal_id INT NOT NULL,
  slot_date DATE NOT NULL,
  timing VARCHAR(10) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_futsal_slot (futsal_id, slot_date, timing),
  CONSTRAINT fk_time_slots_futsal
    FOREIGN KEY (futsal_id) REFERENCES futsals(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(64) NOT NULL,
  futsal_id INT NOT NULL,
  slot_date DATE NOT NULL,
  timing VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_booked_slot (futsal_id, slot_date, timing),
  INDEX idx_bookings_user (user_id),
  CONSTRAINT fk_bookings_futsal
    FOREIGN KEY (futsal_id) REFERENCES futsals(id)
    ON DELETE CASCADE
);
