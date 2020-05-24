const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        let username = req.body.username;
        let password = req.body.password;
        let loadedUser;
        try {
            const user = await User.findOne({ username: username });
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            const verified = await bcrypt.compare(password, user.password);
            if(!verified){
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    username: loadedUser.username,
                    userId: loadedUser._id.toString()
                },
                'bygsecret',
                {expiresIn: '1h'}
            );
            //console.log(token);
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
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