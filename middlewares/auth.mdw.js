module.exports = {
  notLogin: (req, res, next) => {
    if (!req.session.isAuthenticated) {
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    }
    next();
  },
  login: (req, res, next) => {
    if (req.session.isAuthenticated) {
      return res.redirect(`../index`);
    }
    next();
  }
}