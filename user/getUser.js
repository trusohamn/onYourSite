const get =
  process.env.NODE_ENV === 'production'
    ? findEntryPromise
    : findEntryMockPromise;

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const url = config.db();

function findEntryPromise(key) {
  console.log('promise looking for:', key);
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      if (err) return reject(err);
      var dbo = db.db('mydb');
      dbo
        .collection('user')
        .find({ _id: key })
        .toArray(function(err, result) {
          if (err) return reject(err);
          db.close();
          console.log(result[0]);
          return resolve(result[0]);
        });
    });
  });
}
const result = {
  _id: 'firstuser',
  webpages: []
};

function findEntryMockPromise() {
  console.log('sending mock data with promise');
  return new Promise((resolve) => {
    resolve(result);
  });
}

module.exports.get = get;
