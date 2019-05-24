const fs = require('fs');
const qs = require('querystring');
const path = require('path');

const profileData = require('./profileData');
const newProfile = require('./newProfile');
const updateProfile = require('./updataProfile');

const port = process.env.PORT || 8000;

const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static/styles')));
app.use(express.static(path.join(__dirname, 'static/material')));

app.use('/profile', express.static(path.join(__dirname, 'static')));
app.use('/profile', express.static(path.join(__dirname, 'static/styles')));
app.use('/profile', express.static(path.join(__dirname, 'static/material')));


app.get('/', (req, res) => {
    console.log('home');
    fs.readFile('./static/index.html', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(data);
        }
    });
});

app.post('/generate', (req, res) => {
    console.log('generating entry');
    readBodyPromise(req)
        .then(body => {
            const processedData = generateData(qs.parse(body));
            console.log(processedData);
            return newProfile.add(processedData);
        })
        .then(answer => {
            //redirect
            if (answer) {
                res.writeHead(302, {
                    Location: answer
                });
                res.end();
            }
        })
        .catch(error => {
            res.end('Profile already exists!! \n' + error.message);
        });
});
app.post('/preview', (req, res) => {
    console.log('preview personal page');
    readBodyPromise(req)
        .then(body => {
            console.log('rawbody', JSON.parse(body));
            const processedData = generateData(JSON.parse(body));
            console.log('processedData', processedData);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            let page = generatePersonalPage(processedData);
            res.end(JSON.stringify({
                newHTML: page
            }));
        });
});
app.get('/profile/:id', (req, res) => {
    console.log('profile');
    const key = req.params.id;
    profileData.getData(key)
        .then(content => {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            let page = generatePersonalPage(content);
            res.end(page);
        })
        .catch(error => {
            console.log('error in promise handling');
            console.log(error);
        });
});
app.get('/blocking', (req, res) => {
    // let block = true;
    // setTimeout(() => {
    //     block = false;
    // },
    //     1000);
    console.log('BLOCKED!');
    // while (block) {
    // };
    for (i = 0; i < 6e9; i++) {
        if (i % 1000000000 === 0) {
            console.log(i);
        }
    }
    console.log('ACTIVE!');
    res.writeHead(302, {
        Location: '/'
    });
    res.end();

});

app.post('/modify', (req, res) => {

    console.log('modify');
    readBodyPromise(req)
        .then(body => {
            const processedData = generateData(qs.parse(body));
            //console.log(processedData);
            return updateProfile.update(processedData);
        })
        .then(answer => {
            //redirect
            if (answer) {
                res.writeHead(302, {
                    Location: answer
                });
                res.end();
            }
        });

});







app.listen(port, () => console.log(`App listening on port ${port}!`))

//////////////////////////

function generatePersonalPage(data) {

    let output;
    try {
        output =
            `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>On Your Site</title>
            <link rel="stylesheet" href=${data.styles}>
        </head>    
        <body>`;
        data.divs.forEach((e) => {
            if (e.type === 'image') {
                if (e.url) {
                    output += `<img src=${e.url} alt="Your image" class=${e.classN}>`;
                }
            } else if (e.type === 'text') {
                output += `<div class=${e.classN}>${e.text}</div>`;
            }
        });
        output += `</body></html> `;
    } catch (err) {
        console.log(err);
    }
    return output;
}

function sortData(rawData) {
    //sort according to the number xxx_number
    filteredData = [];

    return filteredData;
}

function generateData(rawData) {
    let data = {
        divs: []
    };

    // rawData = sortData(rawData);

    Object.keys(rawData).forEach((k) => {
        if (k === '_id' || k === 'styles') {
            data[k] = rawData[k];
        } else if (/text/.test(k)) {
            data.divs.push({
                type: 'text',
                text: rawData[k],
                classN: rawData['class_' + k.match(/\d+/)[0]]
            });
        } else if (/image/.test(k)) {
            data.divs.push({
                type: 'image',
                url: rawData[k],
                classN: rawData['class_' + k.match(/\d+/)[0]]
            });
        }
    });
    return data;
}

function readBodyPromise(req) {
    return new Promise((resolve, reject) => {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
                reject('overflooded');
            }
        });
        req.on('end', function () {
            resolve(body);
        });
    });
}


module.exports.generateData = generateData;
module.exports.generatePersonalPage = generatePersonalPage;
module.exports.sortData = sortData;
