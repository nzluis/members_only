module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({ message: 'Not Authorized'})
    }
}

module.exports.isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.status === 'Member') {
        next()
    } else {
        res.status(401).json({ message: 'Not Authorized'})
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.status === 'Admin') {
        next()
    } else {
        res.status(401).json({ message: 'Not Authorized'})
    }
}

module.exports.isAlreadyLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
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
    } else {
        next()
    }
}