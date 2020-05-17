const User = require('../models/user');


let authController = {
    signup: async (req, res) => {
        let newUser = new User(req.body);
        let result = await newUser.save();
        res.json({ message: 'User created!', userId: result._id });
    }
}

module.exports = authController;