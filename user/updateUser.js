const {get} = require('./getUser');

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const url = config.db();

function addPage(username, webpage) {
  console.log(username, webpage);
  return new Promise((resolve, reject) => {
    get(username).then(user => {
      MongoClient.connect(url, (err, db) => {
        if (err) return reject(err);
        var dbo = db.db('mydb');
        dbo.collection('user').updateOne(
          { '_id': user._id },
          { $push: { 'webpages': webpage } }, (err, res) => {
            db.close();
            if (err) return reject(err);
            console.log('1 webpage added to user');
            resolve('/profile');
          });
      });
    });
  });
}


module.exports.addPage = addPage;