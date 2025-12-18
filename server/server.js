const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const serverless = require('serverless-http');

dotenv.config();

// Initialize DB
connectDB();

const app = express();

// --- Middleware ---
app.use(cors({
    origin: '*', // Allows your Netlify frontend to communicate
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/files', require('./routes/files'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`.yellow.bold));
module.exports = serverless(app);