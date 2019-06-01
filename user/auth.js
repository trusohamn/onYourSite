const auth = process.env.NODE_ENV === 'production' ? authPromise : authMockPromise;

const MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');

const url = process.env.MONGOLAB_URI;

function authPromise(username, password) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) return reject(err);
      var dbo = db.db('mydb');
      dbo
        .collection('user')
        .find({ _id: username })
        .toArray(function(err, result) {
          if (err) return reject(err);
          db.close();
          console.log(result[0].password, password);
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