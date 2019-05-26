const fs = require('fs');
const qs = require('querystring');
const path = require('path');

const profileData = require('./profileData');
const newProfile = require('./newProfile');
const updateProfile = require('./updataProfile');

const { generateData, generatePersonalPage } = require('./dataProcessing');

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
      const processedData = generateData(JSON.parse(body));
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      let page = generatePersonalPage(processedData);
      res.end(
        JSON.stringify({
          newHTML: page
        })
      );
    })
    .catch(error => {
      console.log(error.message);
    });
});
app.get('/profile/:id', (req, res) => {
  console.log('profile');
  const key = req.params.id;
  profileData
    .getData(key)
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

app.post('/modify', (req, res) => {
  console.log('modify');
  readBodyPromise(req)
    .then(body => {
      const processedData = generateData(qs.parse(body));
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

app.listen(port, () => console.log(`App listening on port ${port}!`));

function readBodyPromise(req) {
  return new Promise((resolve, reject) => {
    var body = '';
    req.on('data', function(data) {
      body += data;
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        req.connection.destroy();
        reject('overflooded');
      }
    });
    req.on('end', function() {
      resolve(body);
    });
  });
}
