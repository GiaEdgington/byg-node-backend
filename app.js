const express = require('express');

const app = express();


app.get('/', (req, res) => {
    res.send('Before You Go');
})

app.listen(3000);