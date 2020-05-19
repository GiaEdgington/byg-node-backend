const User = require('../models/user');


let authController = {
    signup: async (req, res) => {
        let newUser = new User(req.body);
        let result = await newUser.save();
        res.json({ message: 'User created!', userId: result._id });
    },
    getUsers: async (req, res) => {
        try{
            const users = await User.find();
            res.status(200)
            .json({
                message: 'All users.',
                users: users
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = authController;