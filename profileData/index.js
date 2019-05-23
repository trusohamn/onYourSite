//const getData = process.env.NODE_ENV === 'production' ? findEntry : findEntryMock;
const getData = process.env.NODE_ENV === 'production' ? findEntryPromise : findEntryMockPromise;

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGOLAB_URI;

function findEntry(key, callback) {
    console.log('looking for:', key);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("test").find({ _id: key }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            callback(result[0]);
        });
    });
}



function findEntryPromise(key) {
    console.log('promise looking for:', key);
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) errorMessage = err.message;
            var dbo = db.db("mydb");
            dbo.collection("test").find({ _id: key }).toArray(function (err, result) {
                if (err) reject(err);
                db.close();
                console.log(result[0]);
                data = result[0];
                resolve(data);
            });
        });
    });
}
const result =
{
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
            url: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg',
            classN: 'top'
        }
    ]
};

function findEntryMockPromise(key) {
    console.log('sending mock data with promise');
    return new Promise((resolve, reject) => {
        resolve(result);
    });
}

function findEntryMock(key, callback) {
    console.log('sending mock data');
    callback(result);
}

module.exports.getData = getData;