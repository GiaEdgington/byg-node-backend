const express = require('express');

const booksController = require('../controllers/books');
const router = express.Router();

router.get('/books', booksController.getBooks);

module.exports = router;