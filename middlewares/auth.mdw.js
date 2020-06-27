const userModel = require('../model/users.model')

module.exports = {
  notLogin: (req, res, next) => {
    if (!req.session.isAuthenticated) {
      return res.redirect(`/account/login`)
    }
    next()
  },
  login: (req, res, next) => {
    if (req.session.isAuthenticated) {
      return res.redirect('/dashboard')
    }
    next()
  },
  isAdmin: (req, res, next) => {
    if (req.session.authUser.permission != userModel.Admin) {
      return res.redirect('/dashboard')
    }
    next()
  },
  isSubscriber: (req, res, next) => {
    if (req.session.authUser.permission != userModel.Subscriber) {
      return res.redirect('/dashboard')
    }
    next()
  },
  isWriter: (req, res, next) => {
    if (req.session.authUser.permission != userModel.Writer) {
      return res.redirect('/dashboard')
    }
    next()
  }
}