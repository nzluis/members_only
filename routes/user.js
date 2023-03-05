var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/user/signup');
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: "Sign up page"})
})

module.exports = router;
