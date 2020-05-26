var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Post = require('../models/Post');
var Notice = require('../models/Notice');
var User = require('../models/User');
var util = require('../util');

// Home
router.get('/', function(req, res){
  var posts = [];
  Promise.all([
    Post.find({}).sort('-createdAt').skip(0).limit(5).exec(),
    Notice.find({}).sort('-createdAt').skip(0).limit(5).exec(),
    User.findOne({username:req.params.username})
  ]).then(([posts,notice,user])=>{
    res.render('home/welcome', {posts:posts,notice:notice,user:user});
  })
});


router.get('/about', function(req, res){
  res.render('home/about');
});

// Login
router.get('/login', function (req,res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username:username,
    errors:errors
  });
});

// Post Login
router.post('/login',
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      if(req.body.username === 'admin'){
        req.session.is_admin = true;
      }
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/posts',
    failureRedirect : '/login'
  }
));

// Logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

module.exports = router;
