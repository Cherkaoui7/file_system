const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true } // Connects to the binary data
});

module.exports = mongoose.model('File', FileSchema);