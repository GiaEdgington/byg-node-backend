const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    id: {
        type: String
    },
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
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Destination'
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Book', bookSchema);



