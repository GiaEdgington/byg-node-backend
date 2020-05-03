const express = require('express');

const booksController = require('../controllers/books');

const router = express.Router();

router.get('/books', booksController.fetchBooks);

router.get('/saved-books', booksController.getBooks);

router.get('/destinations', booksController.getDestinations);

router.post('/book', booksController.saveBook);

router.post('/destination', booksController.addDestination);

module.exports = router;