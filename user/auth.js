const auth = process.env.NODE_ENV === 'production' ? authPromise : authMockPromise;

const MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');

const config = require('../config');
const url = config.db();

function authPromise(username, password) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) return reject(err);
      var dbo = db.db(config.dbName);
      dbo
        .collection('user')
        .find({ _id: username })
        .toArray(function(err, result) {
          db.close();
          if (err || !result[0]) return reject(err);
          bcrypt.compare(password, result[0].password, (error, auth) => {
            if (auth === true) {
              return resolve(result[0]);
            } else {
              return reject(error);
            }
          });
        });
    });
  });
}

function authMockPromise() {
  console.log('calling authMock');
  return new Promise((resolve) => {
    resolve('/profile/1');
  });
}

module.exports.auth = auth;