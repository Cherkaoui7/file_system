const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http'); // Required package
const app = express();

// --- 🛡️ SECURITY & CORS ---
app.use(cors({
    origin: '*', // Allows your Netlify URL to connect
    credentials: true
}));
app.use(express.json());

// --- 🗄️ DATABASE CONNECTION ---
// Use the environment variable set in Netlify dashboard
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log("Aether DB Connected"))
    .catch(err => console.error("DB Error:", err));

// --- 🚀 API ROUTES ---
app.get('/api/health', (req, res) => {
    res.json({ status: "Super Fast System Online" });
});

// Import your existing routes (Example)
// const fileRoutes = require('./routes/fileRoutes');
// app.use('/api/files', fileRoutes);

// --- ⚡ NETLIFY EXPORT ---
// Do NOT use app.listen(). Netlify manages the execution.
module.exports.handler = serverless(app);