const fs = require('fs');
const http = require('http');
const qs = require('querystring');

const profileData = require('./profileData');
const newProfile = require('./newProfile');

const static = require('./static');

const port = process.env.PORT || 8080;

const server = http
    .createServer((req, res) => {
        console.log(req.url);
        try {
            let path = req.url.split('?')[0];
            if (/.*\.\w+$/.test(path)) {
                static.route(req, res);
            } else {

                path = req.url.match(/^\/[^\/?]*/)[0];
                console.log('path', path);
                switch (path) {
                    case '/': {
                        console.log('home');
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
                        console.log('profile');
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
            <div class=${data.class_1}>${data.text_1}</div>
            <div class=${data.class_2}>${data.text_2}</div>
            <img src=${data.imageUrl} alt="Your image">
        </body>
        
        </html>
    `
    } catch (err) {
        console.log(err);
    };
}