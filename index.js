const port = process.env.PORT || 8000;

const path = require('path');
const express = require('express');
const app = express();

const {session} = require('./session');
app.use(session);

// make user ID available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static/styles')));
app.use(express.static(path.join(__dirname, 'static/material')));
app.use('/profiles', express.static(path.join(__dirname, 'static')));
app.use('/profiles', express.static(path.join(__dirname, 'static/styles')));
app.use('/profiles', express.static(path.join(__dirname, 'static/material')));


const { router } = require('./router');
const { loginRouter } = require('./login');
app.use('/', router);
app.use('/', loginRouter);


app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(500).send('Something broke! ' + err.message);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
