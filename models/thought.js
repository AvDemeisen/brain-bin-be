  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thoughtSchema = new Schema({
    title: String,
    copy: String,
    year: Number,
    tagIds: [String]
});

module.exports = mongoose.model('Thought', thoughtSchema);