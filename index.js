const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGOLAB_URI;

const fs = require('fs');
const http = require('http');
const qs = require('querystring');
const pug = require('pug');

const home = fs.readFileSync('./static/index.html');

const port = process.env.PORT || 8080;

const server = http
    .createServer((req, res) => {
        console.log(req.url);
        try {
            let path = req.url.split('?')[0];
            path = path.match(/\/[^\/?]*$/)[0];
            if (/.*\.js$/.test(path)) {
                fs.readFile('./static' + path, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/javascript' });
                        res.end(data);
                    }
                });
            } else if (/.*\.css$/.test(path)) {
                fs.readFile('./static/styles' + path, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/css' });
                        res.end(data);
                    }
                });
            }
            path = req.url.match(/\/[^\/?]*/)[0];
            switch (path) {
                case '/': {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    let page = pug.renderFile('./views/index.pug', {
                        welcome: ''
                    });
                    res.end(page);
                    break;
                }
                case '/generate': {
                    console.log('generating entry');
                    const query = qs.decode(req.url.split('?')[1]);
                    console.log(query);
                    addEntry(query, (answer) => {
                        //redirect
                        if(answer){
                            res.writeHead(302, { Location: answer });
                            res.end();
                        }
                    });
                    break;
                }
                case '/profile': {
                    const key = req.url.match(/[^?\/]+$/)[0];
                    findEntry(key, (content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        let page = generatePersonalPage(content[0]);
                        res.end(page);
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

function addEntry(entry, callback) {
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

function generatePersonalPage(data) {
    try {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>On Your Site</title>
            <link rel="shortcut icon" href="#">
            <link rel="stylesheet" href=${data.styles}>
        </head>
         
        <body>
            <h1>${data.name}</h1>
            <h2>${data.surname}</h2>
            <img src=${data.imageUrl} alt="Your image">
        </body>
        
        </html>
    `
    } catch (err) {
        console.log(err);
    };
}