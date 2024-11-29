const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    
    url: String,
    filename: String,
    usuario:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fechaSubida: { type: Date, default: Date.now },
});

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
