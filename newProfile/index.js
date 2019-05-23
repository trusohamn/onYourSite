const add = process.env.NODE_ENV === 'production' ? addDBPromise : addMockPromise;

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGOLAB_URI;

function addDBPromise(entry) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, db) => {
            if (err) reject(err);
            var dbo = db.db("mydb");
            dbo.collection("test").insertOne(entry, (err, res) => {
                if (err) reject(err);
                console.log("1 document inserted");
                db.close();
                resolve('/profile/' + entry._id);
            });
        });
    });
}

function addMockPromise(key) {
    console.log('calling addMock');
    return new Promise((resolve, reject) => {
        resolve('/profile/1'); 
    })
}

module.exports.add = add;