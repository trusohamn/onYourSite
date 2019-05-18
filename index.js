const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGOLAB_URI;
console.log('MongoDB url:', url);
const fs = require('fs');
const http = require('http');
const qs = require('querystring');

const home = fs.readFileSync('./static/index.html');

const port = process.env.PORT || 8080;

const server = http
    .createServer((req, res) => {
        const path = req.url.match(/\/[^\/?]*/)[0];
        try {
            switch (path) {
                case '/': {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(home);
                    break;
                }
                case '/generate': {
                    const query = qs.decode(req.url.split('?')[1]);
                    console.log(query);
                    addEntry(query);
                    res.end();
                    break;
                }
                case '/profile': {
                    const key = req.url.match(/[^?\/]+$/)[0];
                    findEntry(key, (content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(JSON.stringify(content));
                    });
                    break;
                }
            }
        }
        catch {
        }
    })
    .listen(port);
server.on('error', (e) => {
    console.log(e);
})


server.on('listening', () => console.log('Server is listening on port', server.address().port));

function addEntry(entry) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("test").insertOne(entry, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}
function findEntry(key, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("test").find({ _id: key }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            callback(result);
        });
    });

}