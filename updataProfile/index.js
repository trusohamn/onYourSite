const update = process.env.NODE_ENV === 'production' ? updatePromise : updateMockPromise;

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGOLAB_URI;

function updatePromise(entry) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, db) => {
            if (err) reject(err);
            var dbo = db.db("mydb");
            dbo.collection("test").replaceOne({_id: entry._id}, entry, (err, res) => {
                if (err) reject(err);
                console.log("1 document updated");
                db.close();
                resolve('/profile/' + entry._id);
            });
        });
    });
}

function updateMockPromise(key) {
    console.log('calling updateMock');
    return new Promise((resolve, reject) => {
        resolve('/profile/1'); 
    })
}

module.exports.update = update;