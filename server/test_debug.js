require('dotenv').config();
console.log("Dotenv loaded");

try {
    const mongoose = require('mongoose');
    console.log("Mongoose loaded");
} catch (e) { console.log("Mongoose failed", e); }

try {
    const fs = require('fs');
    console.log("fs loaded");
} catch (e) { console.log("fs failed", e); }

try {
    const Grid = require('gridfs-stream');
    console.log("gridfs-stream loaded");
} catch (e) { console.log("gridfs-stream failed", e); }

// Try loading the controller
try {
    console.log("Loading files controller...");
    const filesController = require('./controllers/files');
    console.log("Files controller loaded");
} catch (e) {
    console.error("Files controller FAILED:", e);
}

// Try loading the route
try {
    console.log("Loading files route...");
    const filesRoute = require('./routes/files');
    console.log("Files route loaded");
} catch (e) {
    console.error("Files route FAILED:", e);
}

try {
    console.log("Loading config/db...");
    const db = require('./config/db');
    console.log("config/db loaded");
} catch (e) { console.error("config/db FAILED", e); }

try {
    console.log("Loading middleware/error...");
    const errHandler = require('./middleware/error');
    console.log("middleware/error loaded");
} catch (e) { console.error("middleware/error FAILED", e); }

try {
    console.log("Loading auth controller...");
    const authC = require('./controllers/auth');
    console.log("auth controller loaded");
} catch (e) { console.error("auth controller FAILED", e); }

try {
    console.log("Loading auth route...");
    const authR = require('./routes/auth');
    console.log("auth route loaded");
} catch (e) { console.error("auth route FAILED", e); }
