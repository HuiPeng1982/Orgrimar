exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.method == 'GET') {
        req.session.returnTo = req.originalUrl;
    }
    res.redirect('/login');
};

exports.hasBlogAuthorization = function (req, res, next) {
    if (req.blog.user.toString() != req.user._id.toString()) {
        req.flash('error', '你并不是当前用户，请重新登录！');
        return res.redirect('/logout');
    }
    next();
};