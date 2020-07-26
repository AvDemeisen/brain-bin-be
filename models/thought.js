  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thoughtSchema = new Schema({
    title: String,
    copy: String,
    month: Number,
    year: Number,
    tagId: String
});

module.exports = mongoose.model('Thought', thoughtSchema);