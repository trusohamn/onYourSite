const fs = require('fs');
const http = require('http');
const qs = require('querystring');
const pug = require('pug');

//const home = fs.readFileSync('./static/index.html');
const profileData = require('./profileData');
const newProfile = require('./newProfile');

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
                let filename = path.match(/\/[^\/]+\.css/);
                console.log('fetching:' + filename);
                fs.readFile('./static/styles' + filename, (err, data) => {
                    console.log('fetching:' + './static/styles' + filename);
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data.toString());
                        res.writeHead(200, { 'Content-Type': 'text/css' });
                        res.end(data);
                    }
                });
            } else {
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
                        newProfile.add(query, (answer) => {
                            //redirect
                            if (answer) {
                                res.writeHead(302, { Location: answer });
                                res.end();
                            }
                        });
                        break;
                    }
                    case '/profile': {
                        const key = req.url.match(/[^?\/]+$/)[0];
                        profileData.getData(key, (content) => {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            let page = generatePersonalPage(content);
                            res.end(page);
                        });
                        break;
                    }
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