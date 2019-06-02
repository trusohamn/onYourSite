const config = require('../config');

const update = process.env.NODE_ENV === 'production' ? updatePromise : updateMockPromise;

const MongoClient = require('mongodb').MongoClient;
const url = config.db();

function updatePromise(entry) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) reject(err);
      var dbo = db.db('mydb');
      dbo.collection('test').replaceOne({ _id: entry._id }, entry, (err, res) => {
        if (err) reject(err);
        console.log('1 document updated');
        db.close();
        resolve('/profile/' + entry._id);
      });
    });
  });
}

function updateMockPromise() {
  console.log('calling updateMock');
  return new Promise((resolve) => {
    resolve('/profile/1');
  });
}

module.exports.update = update;