const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require('./models/user')
const bcrypt = require('bcryptjs')

const customFields = {
    usernameField: 'username',
    passwordField: 'inputPassword',
}

const verifyCallback = (username, password, done) => {
    User.findOne({ username: username }).then( user => {
        if (!user) return done(null, false, { message: "Username doesn't exists"})

        bcrypt.compare(password, user.password).then(isValid => {
            if(isValid) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password isn't correct"})
            }
        }).catch(err => done(err))
    }).catch(err => {
        done(err)
    })
}

const strategy = new LocalStrategy(customFields, verifyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user)
        }).catch(err => done(err))
})
