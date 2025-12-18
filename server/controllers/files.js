const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { Readable } = require('stream'); // 👈 Required for manual upload

// Init GridFS
let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

exports.uploadFile = async (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ err: 'No files' });

    try {
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const filename = `file_${Date.now()}_${file.originalname}`;
                
                const writestream = gridfsBucket.openUploadStream(filename, {
                    contentType: file.mimetype,
                    // SPEED BOOST: 1MB Chunks for faster writing
                    chunkSizeBytes: 1048576 
                });

                const readStream = Readable.from(file.buffer);
                readStream.pipe(writestream)
                    .on('finish', () => resolve({ _id: writestream.id, filename: writestream.filename }))
                    .on('error', (err) => reject(err));
            });
        });

        const savedFiles = await Promise.all(uploadPromises);
        res.status(201).json({ success: true, files: savedFiles });
    } catch (err) {
        res.status(500).json({ err: 'Upload Failed' });
    }
};

// @desc    Get All Files
// @route   GET /api/files
exports.getFiles = async (req, res) => {
    try {
        const files = await gridfsBucket.find().sort({ uploadDate: -1 }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ err: 'No files exist' });
        }
        return res.json(files);
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
};

// @desc    Get Single File (Public Download/View)
// @route   GET /api/files/:id
exports.getFile = async (req, res) => {
    try {
        const _id = new mongoose.Types.ObjectId(req.params.id);
        const cursor = gridfsBucket.find({ _id });
        const files = await cursor.toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ err: 'No file found' });
        }

        const file = files[0];

        // Stream content based on type
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/gif') {
            res.set('Content-Type', file.contentType);
            const readstream = gridfsBucket.openDownloadStream(_id);
            readstream.pipe(res);
        } else {
            // Force download for other types
            res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
            const readstream = gridfsBucket.openDownloadStream(_id);
            readstream.pipe(res);
        }

    } catch (err) {
        console.error(err);
        res.status(404).json({ err: 'No file found' });
    }
};

// @desc    Delete File
// @route   DELETE /api/files/:id
exports.deleteFile = async (req, res) => {
    try {
        const _id = new mongoose.Types.ObjectId(req.params.id);
        await gridfsBucket.delete(_id);
        res.status(200).json({ success: true, message: 'File deleted' });
    } catch (err) {
        res.status(500).json({ err: 'Could not delete file' });
    }
};