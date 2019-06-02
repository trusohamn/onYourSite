const add =
  process.env.NODE_ENV === 'production' ? addDBPromise : addMockPromise;

const MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');

const config = require('../config');
const url = config.db();

function addDBPromise(entry) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(entry.password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }
      console.log(hash);
      entry.password = hash;

      entry._id = entry.username;
  
      MongoClient.connect(url, (err, db) => {
        if (err) return reject(err);
        var dbo = db.db(config.dbName);
        dbo
          .collection('user')
          .insertOne(entry, (err) => {
            if (err) return reject(err);
            console.log('1 user inserted');
            db.close();
            return resolve(entry);
          });
      });
    });
  });
}

function addMockPromise() {
  console.log('calling addMock');
  return new Promise((resolve) => {
    resolve('/profile');
  });
}

module.exports.add = add;
