const express = require('express');

const router = express.Router();

router.get('/books', (req, res) => {
    res.send('this is for books');
});

module.exports = router;