var express = require('express');
var router = express.Router();
const Message = require('../models/message')

router.get('/', function(req, res, next) {
  if(req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  Message.find().sort({ date: 1 }).exec().then(messages => {
    res.render('index', { title: 'Home page', req, messages });
  }).catch(err => {
    next(err)
  })
  
});

module.exports = router;
