const config = require('./config');
const session = require('express-session');
const express = require('express');
const router = express.Router();
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: config.db(),
  databaseName: config.dbName,
  collection: 'session',
});

store.on('error', function(error) {
  console.log(error);
});

router.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24  // 1 day
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));


module.exports.session = router;