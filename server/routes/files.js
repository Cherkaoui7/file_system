const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, getFile, deleteFile } = require('../controllers/files');
const { protect } = require('../middleware/auth');
const multer = require('multer');

// 👇 CHANGE: Use Memory Storage instead of GridFS Storage
// This prevents the "reading '_id'" crash by keeping files in a buffer temporarily.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/', protect, upload.array('files'), uploadFile);
router.get('/', protect, getFiles);
router.get('/:id', getFile);
router.delete('/:id', protect, deleteFile);

module.exports = router;