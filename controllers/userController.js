const User = require("../models/user")
const Message = require("../models/message")
const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config()
require('../passport')

exports.user_login_get = (req, res, next) => {
    res.render('login', { title: 'Home page', req });
}

exports.loggedRoute = (req, res, next) => {
    switch (req.user.status) {
        case "User":
            res.redirect('/user/logged_user')
            break;
        case "Member":
            res.redirect('/user/logged_member')
            break;
        case "Admin":
            res.redirect('/user/logged_admin')
            break;
    }
}

exports.user_create_get = (req, res) => {
    const errors = ''
    const user = ''
    res.render('signup', { title: "Sign up page", user, errors})
}

exports.user_create_post =  [
    body("first_name", "First Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("last_name", "Last Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("username", "Username must not be empty.").trim().isLength({ min: 1 }).escape().custom(value => {
        return User.findOne({ username: value}).then(user => {
          if (user) {
            return Promise.reject('User already in use');
          }
        })
      }),
    body("inputPassword", "Password must not be empty").trim().isLength({ min: 1 }).escape(),
    body("repeatPassword", "Password confirmation must not be empty").trim().isLength({ min: 1 }).escape(),
    check(
        'repeatPassword',
        'Confirm password field must have the same value as the password field',
    )   
    .exists()
    .custom((value, { req }) => value === req.body.inputPassword),
    async function(req, res, next) {
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: "",
            status: "User"
        })
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("signup", {
                title: "Sign up Form",
                user,
                errors: errors.array(),
            })
            return;
        };
        await bcrypt.hash(req.body.inputPassword, 10, function(err, hashpassword) {
            if (err) {
                return next(err)
            }
            user.password = hashpassword
            user.save().then(() => {
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    res.redirect(`/user/access/${user._id}`);
                  });
            }).catch(err => {
                return next(err)
            })
        })
    }
]

exports.user_update_status_get = (req, res, next) => {
    const errors = ''
    User.findById(req.params.id).then(user => {
        res.render('access', { title: "Member access", username: user.username, errors})
    }).catch(err =>{
        return next(err)
    })
}

let membership = 'user'

exports.user_update_status_post = [
    check(
        'secretWord',
        "The code you inserted doesn't exist",
      )
    .exists()
    .custom((value) => {
        if (value === process.env.MEMBER_KEY) {
            membership = 'Member'
            return true
        }
        if (value === process.env.ADMIN_KEY) {
            membership = 'Admin'
            return true
        }
    }),
    (req, res, next) => {
        const errors = validationResult(req)
        const hasErrors = !errors.isEmpty()
        User.findById( req.params.id ).then((user) => {
            if(hasErrors) {
                res.render('access', { title: "Member access", username: user.username, errors: errors.array()})
            } else {
                try {
                    User.findByIdAndUpdate( req.params.id, {"status": membership}, {new: true}).exec()
                    .then(() => {
                        req.user.status = membership
                        return next()
                    })
                } catch(err) {
                    return next(err)
                }
            }
        }).catch(err => {
            return next(err)
        })
    }
]

module.exports.user_logged_get = (req, res, next) => {
    newMessage = ''
    errors = []
    Message.find().populate('user').sort({ date: 1 }).exec().then(messages => {
        res.render("logged_user", { title: "Home Logged", req, newMessage, messages, user: req.user, errors})
    }).catch(err => {
        next(err)
    })
}

module.exports.user_logged_post = [
    body('title', "Title is required").trim().isLength({ min: 1}).escape(),
    body('message', "Text message is required").trim().isLength({ min: 1 }).escape(),
    (req,res,next) => {
        const errors = validationResult(req)
        const newMessage = new Message({
            title: req.body.title,
            user: req.user._id,
            text: req.body.message
        })
        if(!errors.isEmpty()) {
            Message.find().sort({ date: 1 }).exec().then(messages => {
                res.render('logged_user', { title: "Home Logged", req, newMessage, user: req.user, messages, errors: errors.array()})
            }).catch(err => next(err))
        } else {
            newMessage.save().then(() => {
                res.redirect('/user/logged_user')
            }).catch(err => next(err))
        }
        
    }
]

module.exports.member_logged_get = (req, res, next) => {
    newMessage = ''
    errors = []
    Message.find().sort({ date: 1 }).populate("user").exec().then(messages => {
        res.render("logged_member", { title: "Home Logged", req, newMessage, messages, user: req.user, errors})
    }).catch(err => {
        next(err)
    })
}

module.exports.member_logged_post = [
    body('title', "Title is required").trim().isLength({ min: 1}).escape(),
    body('message', "Text message is required").trim().isLength({ min: 1 }).escape(),
    (req,res,next) => {
        const errors = validationResult(req)
        const hasErrors = !errors.isEmpty()
        const newMessage = new Message({
            title: req.body.title,
            user: req.user,
            text: req.body.message
        })
        if(hasErrors) {
            Message.find().sort({ date: 1 }).populate("user").exec().then(messages => {
                res.render('logged_member', { title: "Home Logged", req, newMessage, user: req.user, messages, errors: errors.array()})
            }).catch(err => next(err))
        } else {
            newMessage.save().then(() => {
                res.redirect('/user/logged_member')
            }).catch(err => next(err))
        }
        
    }
]

module.exports.admin_logged_get = (req, res, next) => {
    newMessage = ''
    errors = []
    Message.find().sort({ date: 1 }).populate("user").exec().then(messages => {
        res.render("logged_admin", { title: "Home Logged", req, newMessage, messages, user: req.user, errors})
    }).catch(err => {
        next(err)
    })
}

module.exports.admin_logged_post = [
    body('title', "Title is required").trim().isLength({ min: 1}).escape(),
    body('message', "Text message is required").trim().isLength({ min: 1 }).escape(),
    (req,res,next) => {
        const errors = validationResult(req)
        const hasErrors = !errors.isEmpty()
        const newMessage = new Message({
            title: req.body.title,
            user: req.user,
            text: req.body.message
        })
        if(hasErrors) {
            Message.find().sort({ date: 1 }).populate("user").exec().then(messages => {
                res.render('logged_admin', { title: "Home Logged", req, newMessage, user: req.user, messages, errors: errors.array()})
            }).catch(err => next(err))
        } else {
            newMessage.save().then(() => {
                res.redirect('/user/logged_admin')
            }).catch(err => next(err))
        }
    }
]

module.exports.delete_message_get = (req, res, next) => {
    Message.findOne({ _id: req.params.id }).populate("user").exec().then(msg => {
        res.render('delete', { title: 'Delete Message', message: msg, user: msg.user})
    }).catch(err => next(err))
    
}
module.exports.delete_message_post = (req, res, next) => {
    Message.findByIdAndRemove(req.params.id).then(() => {
        res.redirect('/user/logged_admin')
    }).catch(err => next(err))
}

module.exports.logout_post = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
}