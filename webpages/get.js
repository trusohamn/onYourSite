const getData =
  process.env.NODE_ENV === 'production'
    ? findEntryPromise
    : findEntryMockPromise;

const config = require('../config');

const MongoClient = require('mongodb').MongoClient;
const url = config.db();

function findEntryPromise(key) {
  console.log('promise looking for:', key);
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      if (err) return reject(err);
      var dbo = db.db('mydb');
      dbo
        .collection('test')
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
  _id: 1,
  styles: 'red.css',
  divs: [
    {
      type: 'text',
      text: 'first',
      classN: 'header'
    },
    {
      type: 'text',
      text: 'second',
      classN: 'normal'
    },
    {
      type: 'text',
      text: 'third',
      classN: 'bold'
    },
    {
      type: 'image',
      url:
        'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg',
      classN: 'top'
    }
  ]
};

function findEntryMockPromise() {
  console.log('sending mock data with promise');
  return new Promise((resolve) => {
    resolve(result);
  });
}

module.exports.getData = getData;
