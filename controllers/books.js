const fetch = require('node-fetch');

const Book = require('../models/book');
const Destination = require('../models/destination');

exports.fetchBooks = async (req, res) => {

    const GOOGLE_BOOKS_API_KEY = 'AIzaSyCUZDVxJS93fWmpk3QKfscn15qz7segx-4';
    let destination = req.query.destination;
    let books = [];
    var bookList = [];
    //console.log(destination);

    try{
        //Fetch Wikipedia API for books destination based --- LIMIT SET TO 5
        const response = await fetch(encodeURI(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${destination}&cmlimit=5&origin=*`));

        const bookTitles = await response.json();
        //console.log(bookTitles.query.categorymembers);

        await bookTitles.query.categorymembers.forEach(title => { 
            //check for duplicates
            if(!books.includes(title.title))
            books.push(title.title);
        });

        //console.log(books);

        //Need to await Promise.all for aditional async fetch
        await Promise.all(books.map(async (book) => {
            let result = await fetch(`https://www.googleapis.com/books/v1/volumes?q=+title:${book}&maxResults=1&key=${GOOGLE_BOOKS_API_KEY}`);
            let resJson = await result.json();
            
            let id = typeof resJson.items[0].volumeInfo.industryIdentifiers[0].identifier === "undefined" ? "" : resJson.items[0].volumeInfo.industryIdentifiers[0].identifier;
            let title = typeof resJson.items[0].volumeInfo.title === "undefined" ? "" : resJson.items[0].volumeInfo.title;
            let author = [""]; //resJson.items[0].volumeInfo.authors === "undefined" ? "" : resJson.items[0].volumeInfo.authors;
            if (typeof (resJson.items[0].volumeInfo.authors) !== "undefined"){
                author = resJson.items[0].volumeInfo.authors;
            }
            let image = typeof resJson.items[0].volumeInfo.imageLinks === "undefined" ? "" : resJson.items[0].volumeInfo.imageLinks.smallThumbnail;
            let synopsis = typeof resJson.items[0].volumeInfo.description === "undefined" ? "Information not available." : resJson.items[0].volumeInfo.description;

            let bookData = {
                    "id": id,
                    "title": title, 
                    "author" : author,
                    "image": image,
                    "synopsis": synopsis
                };

                bookList.push(bookData);
            }) 
        );

        //need to filter bookList
        let uniqList = [];
        let bookIds = await bookList.map(book => {
            return book.id;
        });

        let uniqBookIds = [...new Set(bookIds)];

        bookList.forEach(book => {
            let index = uniqBookIds.indexOf(book.id);

            if(uniqBookIds.includes(book.id)){
                uniqList.push(book);
                if(index > -1){
                    uniqBookIds.splice(index, 1);
                }
            }
        });

        //console.log(uniqBookIds);
        //console.log(uniqList);
        res.send(uniqList);

    } catch (err) {
        console.log(err);
    }
};

 exports.saveBook = async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const image = req.body.image;
    const synopsis = req.body.synopsis;
    const location = req.body.location;

    try {
    let book = await Book.findOne({location: location, title: title});

    if(!book) {
        book = new Book({
            title: title,
            author: author,
            image: image,
            synopsis: synopsis,
            location: location
        });
        await book.save();
        const destination = await Destination.findById(location);
        destination.books.push(book);
        await destination.save();
    }
        res.status(201).json({
            message: 'Book saved.',
            book: book
        });
    } catch(err) {
        console.log(err);
    }
};

exports.getBooks = async (req, res) => {
    try{
        const books = await Book.find();
        res.status(200)
        .json({
            message: 'Saved books.',
            books: books
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getBook = async (req, res) => {
    let bookId = req.params.bookId;

    try {
        const book = await Book.findOne({ _id: bookId });
        res.status(200)
        .json({
            message: 'Book info.',
            book: book
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getDestinations = async (req, res) => {
    try{
        const totalDestinations = await Destination.find().countDocuments();
        const destinations = await Destination.find();

        let setting = destinations.destinations;

        const locations = destinations.map(setting => setting.location);
        const destinationId = destinations.map(location => location._id);
        //get books for destination
        //const books = await Book.find({location: destinationId});

        res.status(200)
        .json({ 
            message: 'Fetched destinations', 
            destinationId: destinationId,
            destinations: locations
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getDestination = async (req, res) => {
    let destinationId = req.params.destinationId;

    try {
        const destination = await Destination.findOne({ _id: destinationId });

        res.status(200)
        .json({
            message: 'Destination info.',
            destination: destination
        });
    } catch (err) {
        console.log(err);
    }  
}

exports.addDestination = async (req, res) => {
    const location = req.body.location;
    const books = req.body.books;

    try {
        let destination = await Destination.findOne({location: location});
        if(!destination) {
            destination = new Destination({
            location:location,
            books: books
            });
            await destination.save();
        }
        res.status(201).json({
            message: 'Destination created.',
            id: destination._id
        });
        //console.log(destination);
        } catch (err) {
        console.log(err);
    }
};