var express = require('express');
var router = express.Router();
var User = require('./user');
var mid = require('./middleware');



router.get('/profile', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId).exec((error, data) => {
    if (error) {
      return next(error);
    } else {
      return res.render('profile', {
        title: 'Profile',
        username: data.username,
        webpages: data.webpages,
      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
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
    User.authenticate(req.body.username, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong username or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Username and password are required.');
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
    // confirm that user typed same password twice
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    // create object with form input
    var userData = {
      username: req.body.username,
      password: req.body.password,
      webpages: [],
    };

    // use schema's `create` method to insert document into Mongo
    User.create(userData, function(error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});



module.exports.loginRouter = router;
