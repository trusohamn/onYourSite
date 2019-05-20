const fs = require('fs');

function route(req, res) {
    let path = req.url.split('?')[0];
    path = path.match(/\/[^\/?]*$/)[0];
    console.log('static path',path);
    if (/.*\.js$/.test(path)) {
        console.log('sending js file');
        fs.readFile('./static' + path, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.end(data);
            }
        });

    } else if (/.*\.css$/.test(path)) {
        console.log('sending css file');
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

    }
}


module.exports.route = route;