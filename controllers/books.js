const fetch = require('node-fetch');

exports.getBooks = async (req, res) => {

    let destination = "Chicago";
    let books = [];

    try{
        const response = await fetch(encodeURI(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${destination}&cmlimit=18&origin=*`))
        const bookTitles = await response.json()

        bookTitles.query.categorymembers.forEach(title => { 
            books.push(title.title);
        });
        res.send(books);
    } catch (err) {
        console.log(err);
    }
};