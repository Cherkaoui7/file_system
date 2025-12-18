const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // High-speed stability settings
            maxPoolSize: 10,           // Allows multiple simultaneous data lanes
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,    // Keeps the pipe open for large files
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (err) {
        console.error(`Database Connection Error: ${err.message}`.red);
        process.exit(1);
    }
};

module.exports = connectDB;