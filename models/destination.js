const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
});

module.exports = mongoose.model('Destination', destinationSchema);