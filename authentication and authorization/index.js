const express = require('express');
const register = require('./register.js');
const mongoose = require('mongoose');
const auth = require('./auth.js');
const app = express();
const cors = require('cors');
const me = require('./me.js');
const port = 1000;
const config = require("config");
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token','Access-Control-Allow-Origin']
  }));
  

if (!config.get('jwtPrivateKey')){
    console.error("Fatal error: jwtPrivateKey not defined");
    process.exit(1);
}

// Mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/myFutsal',{
    useNewUrlParser: true,
  }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


app.use('/api/register', register);
app.use('/api/auth', auth);
app.use('/me',me);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
