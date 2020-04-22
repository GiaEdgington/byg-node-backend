const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const bookRoutes = require('./routes/books');

app.use(bodyParser.json());

app.use('/', bookRoutes);


app.get('/', (req, res) => {
    res.send('Before You Go');
})

app.listen(3000);