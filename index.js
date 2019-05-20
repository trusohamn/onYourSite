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
                        readBody(req, body => {
                            const processedData = generateData(body);
                            console.log(processedData);
                            newProfile.add(processedData, (answer) => {
                                //redirect
                                if (answer) {
                                    res.writeHead(302, { Location: answer });
                                    res.end();
                                }
                            });
                        });

                        break;
                    }
                    case '/preview': {
                        console.log('preview personal page');
                        readBody(req, body => {
                            const processedData = generateData(body);
                            console.log(processedData);
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            let page = generatePersonalPage(processedData);
                            res.end(page);
                        });
                        break;
                    }
                    case '/profile': {
                        console.log('profile');
                        const key = req.url.match(/[^?\/]+$/)[0];
                        profileData.getData(key)
                            .then(content => {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                let page = generatePersonalPage(content);
                                res.end(page);
                            })
                            .catch(error => {
                                console.log('error in promise handling');
                                console.log(error);
                            });

                        /* //CALLBACK
                        profileData.getData(key, (content) => {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            let page = generatePersonalPage(content);
                            res.end(page);
                        });
                        */
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
    let output;
    try {
        output = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>On Your Site</title>
            <link rel="stylesheet" href=${data.styles}>
        </head>    
        <body>`;
        if (data.image.url) {
            output += `<img src=${data.image.url} alt="Your image">`;
        }
        data.divs.forEach((e) => {
            output += `<div class=${e.classN}>${e.text}</div>`;
        });
        output += `</body></html> `;
    } catch (err) {
        console.log(err);
    }
    return output;
}

function generateData(rawData) {
    let data = {
        divs: [],
        image: {}
    };
    Object.keys(rawData).forEach((k) => {
        if (k === 'imageUrl') {
            data.image.url = rawData[k];
        } else if (k === '_id' || k === 'styles') {
            data[k] = rawData[k];
        } else if (/text/.test(k)) {
            data.divs.push({
                text: rawData[k],
                classN: rawData['class_' + k.match(/\d+/)[0]]
            });
        }
    });

    return data;
}

function readBody(req, callback) {
    var body = '';
    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    req.on('end', function () {
        var query = qs.parse(body);
        callback(query);
    });
}