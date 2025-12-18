const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const dotenv = require('dotenv');

dotenv.config();

// Create storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            console.log("👉 [STORAGE] Received File:", file.originalname);

            // Create a unique filename with timestamp
            const filename = `${Date.now()}-${file.originalname}`;

            const fileInfo = {
                filename: filename,
                bucketName: 'uploads' // Matches the collection name
            };
            resolve(fileInfo);
        });
    }
});

// Optional: Filter to allow specific file types
const fileFilter = (req, file, cb) => {
    // Currently accepting ALL files. 
    // You can add logic here to reject files if needed.
    cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;