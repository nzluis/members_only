var express = require('express');
var router = express.Router();
const passport = require("passport")
const isAuth = require('./auth').isAuth
const isMember = require('./auth').isMember
const isAdmin = require('./auth').isAdmin
const isAlreadyLogin = require('./auth').isAlreadyLogin

const userController = require('../controllers/userController')

router.get('/', function(req, res, next) {
  res.redirect('/user/signup');
});

router.get('/signup', userController.user_create_get)
router.post('/signup', userController.user_create_post)

router.get('/access/:id', userController.user_update_status_get)
router.post('/access/:id', userController.user_update_status_post, userController.loggedRoute)

router.get('/login', isAlreadyLogin, userController.user_login_get)

// BUG!!! Mensajes de error en LOGIN : 'Missing Credentials'
router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', failureMessage: true}), userController.loggedRoute )
//--------------------------------------------------------------------------------------------------------------------

router.get('/logged_user', isAuth, userController.user_logged_get)
router.post('/logged_user', isAuth, userController.user_logged_post)

router.get('/logged_member', isMember, userController.member_logged_get)
router.post('/logged_member', isMember, userController.member_logged_post)

router.get('/logged_admin', isAdmin, userController.admin_logged_get)
router.post('/logged_admin', isAdmin, userController.admin_logged_post)

router.get('/message/:id', isAdmin, userController.delete_message_get)
router.post('/message/:id', isAdmin, userController.delete_message_post)

router.get('/logout', userController.logout_post)


module.exports = router;
