const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const register = require('./routes/register.js');
const mongoose = require('mongoose');
const auth = require('./routes/auth.js');
const app = express();
const cors = require('cors');
const me = require('./routes/me.js');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const port = process.env.AUTH_SERVICE_PORT || process.env.PORT || 1000;
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || path.join(__dirname, '../config');
const config = require("config");
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token','Access-Control-Allow-Origin']
  }));
  

if (!(process.env.JWT_PRIVATE_KEY || config.get('jwtPrivateKey'))){
    console.error("Fatal error: jwtPrivateKey not defined");
    process.exit(1);
}

// Mongoose connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myFutsal').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


app.use('/api/register', register);
app.use('/api/auth', auth);
app.use('/me',me);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'auth-service' });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
