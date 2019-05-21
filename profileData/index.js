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
    _id: 'styling',
    divs: [
        {
            classN: 'class1',
            text: 'first'
        },
        {
            classN: 'class2',
            text: 'second'
        },
        {
            classN: 'header',
            text: 'Tasmanian!!'
        }
    ],
    image: {
        url :'https://animals.sandiegozoo.org/sites/default/files/2016-09/animals_hero_tasmaniandevil.jpg'  
    },
    styles: 'black.css'
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