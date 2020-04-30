const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
    },
    image: {
        type: String
        },
    synopsis: {
        type: String
    }
});

module.exports = mongoose.model('Book', bookSchema);



