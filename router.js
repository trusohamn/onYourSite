const express = require('express');
const router = express.Router();

const qs = require('querystring');

const webpages = require('./webpages');

const { generateData, generatePersonalPage } = require('./dataProcessing');

router.get('/', function(req, res) {
  console.log('new home');
  return res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res) {
  return res.render('about', { title: 'About' });
});

router.get('/create', function(req, res) {
  return res.render('create', { title: 'Creator' });
});

router.post('/generate', (req, res) => {
  console.log('generating entry');
  const processedData = generateData(req.body);
  webpages
    .add(processedData, req.session.userId)
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
  const processedData = generateData(req.body);
  console.log(processedData);
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  let page = generatePersonalPage(processedData);
  console.log(page);
  res.end(
    JSON.stringify({
      newHTML: page
    })
  );
});

router.get('/profiles/:id', (req, res) => {
  console.log('profiles');
  const key = req.params.id;
  webpages
    .get(key)
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
  const processedData = generateData(qs.parse(req.body));
  webpages
    .update(processedData)
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

router.get('/modify/:id', (req, res) => {
  //get the data about the website id
  const key = req.params.id;
  webpages
    .get(key)
    .then(content => {

    });
  //fill the create form with those values

  //send the modify page
  
});

module.exports.router = router;
