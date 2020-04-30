const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const bookRoutes = require('./routes/books');

app.use(cors());
app.use(bodyParser.json());

app.use('/', bookRoutes);

app.use((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

app.get('/', (req, res) => {
    res.send('Before You Go');
})

mongoose.connect(
    'mongodb+srv://gia-edgington:password_db@clusternode-szpnr.mongodb.net/before_you_go?retryWrites=true'
)
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err)
});
