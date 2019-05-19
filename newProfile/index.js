const add = process.env.NODE_ENV === 'production' ? addDB : addMock;

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGOLAB_URI;

function addDB(entry, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("test").insertOne(entry, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
            callback('/profile/' + entry._id);
        });
    });
}


function addMock(key, callback) {
    console.log('calling addMock');
    callback('/profile/1');
}

module.exports.add = add;