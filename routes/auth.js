const express = require('express');


const authController = require('../controllers/auth');

const router = express.Router();

router.post('/users', authController.signup);

router.get('/users', authController.getUsers);

router.post('/login', authController.login);

module.exports = router;