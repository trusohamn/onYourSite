const path = require('path');

const port = process.env.PORT || 8000;

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://localhost:27017/users');
const db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(
  session({
    secret: 'i dont have any secrets for you',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

// make user ID available in templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
// parse incoming requests
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





app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


app.listen(port, () => console.log(`App listening on port ${port}!`));
