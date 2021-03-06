const add =
  process.env.NODE_ENV === 'production' ? addDBPromise : addMockPromise;

const config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const url = config.db();

function addDBPromise(entry, currentUser) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) return reject(err);
      var dbo = db.db(config.dbName);
      dbo.collection('test').insertOne(entry, (err) => {
        db.close();
        if (err) return reject(err);
        console.log('1 webpage inserted');
        if(currentUser){
          const {addPage} = require('../user');
          addPage(currentUser, entry._id);
        }
        return resolve('/profiles/' + entry._id);
      });
    });
  });
}

function addMockPromise() {
  console.log('calling addMock');
  return new Promise((resolve) => {
    resolve('/profiles/1');
  });
}

module.exports.add = add;
