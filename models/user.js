const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    destinations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Destination'
        }
    ]
});

//write schema method
/* userSchema.methods.removeDestination = function(destination) {
    destination.books = [];
    return destinationSchema.save;
}
 */

module.exports = mongoose.model('User', userSchema);