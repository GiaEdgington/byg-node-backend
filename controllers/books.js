const fetch = require('node-fetch');

exports.getBooks = async (req, res) => {

    const GOOGLE_BOOKS_API_KEY = 'AIzaSyCUZDVxJS93fWmpk3QKfscn15qz7segx-4';
    let destination = "Chicago";
    let books = [];
    var bookList = [];

    try{
        //Fetch Wikipedia API for books destination based --- LIMIT SET TO 5
        const response = await fetch(encodeURI(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${destination}&cmlimit=5&origin=*`));

        const bookTitles = await response.json();

        await bookTitles.query.categorymembers.forEach(title => { 
            books.push(title.title);
        });
 
        //Need to await Promise.all for aditional async fetch
        await Promise.all(books.map(async (book) => {
            let result = await fetch(`https://www.googleapis.com/books/v1/volumes?q=+title:${book}&maxResults=1&key=${GOOGLE_BOOKS_API_KEY}`);
            let resJson = await result.json();
            
            let title = resJson.items[0].volumeInfo.title === "undefined" ? "" : resJson.items[0].volumeInfo.title;
            let authors = resJson.items[0].volumeInfo.authors === "undefined" ? "" : resJson.items[0].volumeInfo.authors;
            let image = resJson.items[0].volumeInfo.imageLinks === "undefined" ? "" : resJson.items[0].volumeInfo.imageLinks.smallThumbnail;
            let synopsis = resJson.items[0].volumeInfo.description === "undefined" ? "Information not available." : resJson.items[0].volumeInfo.description;

            let bookData = [ title, authors, image, synopsis ];

            bookList.push(bookData);
            //console.log(resJson.items[0].volumeInfo.authors);
            }) 
        );
        res.send(bookList);
    } catch (err) {
        console.log(err);
    }
};