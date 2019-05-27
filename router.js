const express = require('express');
const router = express.Router();

const qs = require('querystring');
const path = require('path');

const profileData = require('./profileData');
const newProfile = require('./newProfile');
const updateProfile = require('./updataProfile');

const { generateData, generatePersonalPage } = require('./dataProcessing');
router.get('/', (req, res) => {
  console.log('home');
  res.sendFile(path.join(__dirname+'/static/index.html'));
});
router.post('/generate', (req, res) => {
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
      res.status(403);
      res.end('Profile already exists!! \n' + error.message);
    });
});
router.post('/preview', (req, res) => {
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
      res.status(404).end(error.message);
    });
});
router.get('/profile/:id', (req, res) => {
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
      res.status(404).end(error.message);
    });
});
router.post('/modify', (req, res) => {
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
    })
    .catch(error => {
      res.status(404).end(error.message);
    });
});

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

module.exports.router = router;
