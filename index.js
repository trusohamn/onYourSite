const port = process.env.PORT || 8000;

const config = require('./config');
const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: config.db(),
  collection: 'mySessions'
});
store.on('error', function(error) {
  console.log(error);
});

app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24  // 1 day
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

// make user ID available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

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
