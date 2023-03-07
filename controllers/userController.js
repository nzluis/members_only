const User = require("../models/user")
const Message = require("../models/message")
const async = require("async")
const { check, body, validationResult } = require('express-validator');
const validator = require("validator")
const bcrypt = require('bcryptjs');
require('dotenv').config()

exports.user_create_get = (req, res) => {
    const errors = ''
    const user = ''
    res.render('signup', { title: "Sign up page", user, errors})
}

exports.user_create_post =  [
    body("first_name", "First Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("last_name", "Last Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("username", "Username must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("inputPassword", "Password must not be empty").trim().isLength({ min: 1 }).escape(),
    body("repeatPassword", "Password confirmation must not be empty").trim().isLength({ min: 1 }).escape(),
    check(
        'repeatPassword',
        'Confirm password field must have the same value as the password field',
      )
        .exists()
        .custom((value, { req }) => value === req.body.inputPassword),

    async (req, res, next) => {
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: "",
            status: "User"
        })
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            User.find().then(results => {
                res.render("signup", {
                    title: "Sign up Form",
                    user,
                    errors: errors.array(),
                })
            }).catch(err => {
                return next(err)
            })
            return;
        };
        await bcrypt.hash(req.body.inputPassword, 10, function(err, hashpassword) {
            if (err) {
                return next(err)
            }
            user.password = hashpassword
            user.save().then(() => {
                res.redirect(`/user/access/${user._id}`)
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
        console.log(req.params.id)
        User.findById( req.params.id ).then((user) => {
            console.log(user)
            if(hasErrors) {
                console.log(user.status)
                res.render('access.ejs', { title: "Member access", username: user.username, errors: errors.array()})
            } else {
                try {
                    User.findByIdAndUpdate( req.params.id, {"status": membership}, {new: true}).exec()
                    .then(updatedUser => {
                        console.log(updatedUser.status)
                        res.render("index", { title: "Home Logged", user: updatedUser})
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