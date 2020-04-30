const express = require('express');

const booksController = require('../controllers/books');
const router = express.Router();

router.get('/books', booksController.getBooks);

router.post('/book', booksController.saveBook);

module.exports = router;