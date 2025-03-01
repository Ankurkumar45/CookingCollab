const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    text: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
}, { timestamps: true });

module.exports = mongoose.model('comment', CommentSchema);