const getData = process.env.NODE_ENV === 'production' ? findEntry : findEntryMock;

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

function findEntryMock(key, callback) {
    console.log('sending mock data');
    const result =
    {
        _id: 'styling',
        divs :[
            {
                classN: 'class1',
                text: 'first'
            },
            {
                classN: 'class2',
                text: 'second'
            }
        ],
        imageUrl:
            'https://animals.sandiegozoo.org/sites/default/files/2016-09/animals_hero_tasmaniandevil.jpg',
        styles: 'black.css'
    }
    callback(result);
}

module.exports.getData = getData;