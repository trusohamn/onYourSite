var express = require('express');
var router = express.Router();
var user = require('../user');
var mid = require('./middleware');

router.get('/profile', mid.requiresLogin, function(req, res, next) {
  user.get(req.session.userId)
    .then( data => {
      console.log(data);
      return res.render('profile', {
        title: 'Profile',
        username: data.username,
        webpages: data.webpages,
      });
    })
    .catch (err => next(err));
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.get('/login', mid.loggedOut, function(req, res) {
  return res.render('login', { title: 'Log In' });
});

router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.password) {
    user.auth(req.body.username, req.body.password)
      .then(user => {
        req.session.userId = user._id;
        return res.redirect('/profile');
      })
      .catch(() => {
        const err = new Error('Wrong username or password.');
        err.status = 401;
        return next(err);
      });
  }   
  else {
    const err = new Error('Username and password are required.');
    err.status = 401;
    return next(err);
  }
});

router.get('/register', mid.loggedOut, function(req, res) {
  return res.render('register', { title: 'Sign Up' });
});

router.post('/register', function(req, res, next) {
  if (
    req.body.username &&
    req.body.password &&
    req.body.confirmPassword
  ) {
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    var userData = {
      username: req.body.username,
      password: req.body.password,
      webpages: [],
    };

    user.add(userData)
      .then(user => {
        req.session.userId = user._id;
        console.log('####', req.session.userId);
        return res.redirect('/profile');
      })
      .catch(err => next(err));

  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});



module.exports.loginRouter = router;
