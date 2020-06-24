const userModel = require('../model/users.model')

module.exports = {
  notLogin: (req, res, next) => {
    if (!req.session.isAuthenticated) {
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`)
    }
    next()
  },
  login: (req, res, next) => {
    if (req.session.isAuthenticated) {
      return res.redirect(`../index`)
    }
    next()
  },
  isAdmin: (req, res, next) => {
    if (req.session.isAuthenticated && req.session.authUser == userModel.Admin) {
      next()
    }
    return res.redirect(`../index`)
  },
  isSubscriber: (req, res, next) => {
    if (req.session.isAuthenticated && req.session.authUser == userModel.Subscriber) {
      next()
    }
    return res.redirect(`../index`)
  },
  isWriter: (req, res, next) => {
    if (req.session.isAuthenticated && req.session.authUser == userModel.Writer) {
      next()
    }
    return res.redirect(`../index`)
  }
}