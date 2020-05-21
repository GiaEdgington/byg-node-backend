const bcrypt = require('bcrypt');

const User = require('../models/user');


let authController = {
    signup: async (req, res) => {

        let username = req.body.username;
        let password = req.body.password;

        try{
            let hashPassword = await bcrypt.hash(password, 12);
            let user = new User({
                username: username,
                password: hashPassword
            });
            let result = await user.save();
            res.json({ message: 'User created!', userId: result._id });
        } catch (err){
            console.log(err);
        }  
    },
    login: async (req, res) => {
        try {
            const user = User.findOne({username: req.body.username});
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 401;
                throw error;
            }
        } catch (err) {
            console.log(err);
        }
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