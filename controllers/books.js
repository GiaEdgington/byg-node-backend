const fetch = require('node-fetch');

exports.getBooks = async (req, res) => {

    const GOOGLE_BOOKS_API_KEY = 'AIzaSyCH0tIhWJCGZf1HFjw_hRFlJ0vlNuLVtf8';
    let destination = req.query.destination;
    let books = [];
    var bookList = [];
    //console.log(destination);

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
            
            let id = typeof resJson.items[0].id === "undefined" ? "" : resJson.items[0].id;
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
        res.send(bookList);
    } catch (err) {
        console.log(err);
    }
};