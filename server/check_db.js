const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/advanced-file-system');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const db = mongoose.connection.db;
        const filesCollection = db.collection('uploads.files');
        const chunksCollection = db.collection('uploads.chunks');

        const files = await filesCollection.find().toArray();
        console.log(`\nFound ${files.length} files in GridFS 'uploads.files':`);

        for (const file of files) {
            console.log('--------------------------------------------------');
            console.log(`_id: ${file._id}`);
            console.log(`filename: ${file.filename}`);
            console.log(`length: ${file.length} bytes`);
            console.log(`contentType: ${file.contentType}`); // gridfs-stream sometimes uses contentType, metadata often has it
            console.log(`uploadDate: ${file.uploadDate}`);
            console.log(`metadata:`, file.metadata);

            // Check chunks
            const chunkCount = await chunksCollection.countDocuments({ files_id: file._id });
            console.log(`Chunks found: ${chunkCount}`);
        }

        console.log('\nChecking "files" collection (Metadata):');
        const File = require('./models/File');
        const metaFiles = await File.find();
        console.log(`Found ${metaFiles.length} metadata records.`);
        for (const mf of metaFiles) {
            console.log(`\nMeta ID: ${mf._id}`);
            console.log(`Original Name: ${mf.originalName}`);
            console.log(`GridFS ID: ${mf.gridFsId}`);
            console.log(`Size: ${mf.size}`);

            // Verify link
            const linkedFile = files.find(f => f._id.toString() === mf.gridFsId.toString());
            if (linkedFile) {
                console.log(`✅ LINKED OK: Metadata -> GridFS File (${linkedFile.length} bytes)`);
            } else {
                console.log(`❌ BROKEN LINK: GridFS file not found for this metadata!`);
            }
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
