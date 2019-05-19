const fs = require('fs');
const http = require('http');
const qs = require('querystring');

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
                fs.readFile('./static/styles' + filename, (err, data) => {
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
                        fs.readFile('./static/index.html', (err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(data);
                            }
                        });
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
                    case '/preview': {
                        console.log('preview personal page');
                        const query = qs.decode(req.url.split('?')[1]);
                        console.log(query);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        let page = generatePersonalPage(query);
                        res.end(page);
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
        catch (err) {
            console.log(err);
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
            <link rel="stylesheet" href=${data.styles}>
        </head>
         
        <body>
            <h1 class=${data.class_1}>${data.text_1}</h1>
            <h2 class=${data.class_2}>${data.text_2}</h2>
            <img src=${data.imageUrl} alt="Your image">
        </body>
        
        </html>
    `
    } catch (err) {
        console.log(err);
    };
}