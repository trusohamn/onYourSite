const path = require('path');

const port = process.env.PORT || 8000;

const express = require('express');
const app = express();
const { router } = require('./router');

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static/styles')));
app.use(express.static(path.join(__dirname, 'static/material')));

app.use('/profile', express.static(path.join(__dirname, 'static')));
app.use('/profile', express.static(path.join(__dirname, 'static/styles')));
app.use('/profile', express.static(path.join(__dirname, 'static/material')));

app.use('/', router);

app.listen(port, () => console.log(`App listening on port ${port}!`));
