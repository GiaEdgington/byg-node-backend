const fetch = require('node-fetch');

exports.getBooks = async (req, res) => {

    const GOOGLE_BOOKS_API_KEY = 'AIzaSyCUZDVxJS93fWmpk3QKfscn15qz7segx-4';
    let destination = "Chicago";
    let books = [];
    var bookList = [];

    try{
        const response = await fetch(encodeURI(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${destination}&cmlimit=18&origin=*`));

        const bookTitles = await response.json();

        await bookTitles.query.categorymembers.forEach(title => { 
            books.push(title.title);
        });
 
        await Promise.all(books.map(async (book) => {
            let result = await fetch(`https://www.googleapis.com/books/v1/volumes?q=+title:${book}&maxResults=1&key=${GOOGLE_BOOKS_API_KEY}`);
            let resJson = await result.json();
            //console.log(resJson);
            bookList.push(resJson);
            })
        );
        console.log(bookList[0]);
        //res.send(books);
    } catch (err) {
        console.log(err);
    }
};