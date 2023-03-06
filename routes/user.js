var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')

router.get('/', function(req, res, next) {
  res.redirect('/user/signup');
});

router.get('/signup', userController.user_create_get)

router.post('/signup', userController.user_create_post)

router.get('/access/:id', userController.user_update_status_get)

router.post('/access/:id', userController.user_update_status_post)

module.exports = router;
