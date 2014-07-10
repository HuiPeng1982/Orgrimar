var account = require('../routes/account'),
    blog = require('../routes/blog'),
    setting = require('../routes/setting'),
    auth = require('../lib/auth');

module.exports = function (app, passport) {
    app.get('/', auth.requiresLogin, blog.list);

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return done(err); }
            if (!user) {
                req.flash('error', info.message);
                return res.redirect('/login');
            }
            req.logIn(user, function(err) {
                if (err) { return done(err); }
                var url = '/';
                if (req.session && req.session.returnTo) {
                    url = req.session.returnTo;
                    delete req.session.returnTo;
                }
                return res.redirect(url);
            });
        })(req, res, next);
    });

    app.get('/login', account.login);
    app.get('/register', account.register);
    app.get('/logout', account.logout);
    app.post('/register', account.signup);

    app.param('id', blog.load);
    app.get('/blog/new', auth.requiresLogin, blog.new);
    app.post('/blog/new', auth.requiresLogin, blog.create);

    app.get('/blog/:id/edit', [auth.requiresLogin], blog.edit);
    app.put('/blog/:id', [auth.requiresLogin, auth.hasBlogAuthorization], blog.update);

    app.get('/blog/:id/delete', [auth.requiresLogin, auth.hasBlogAuthorization], blog.delete);

    app.get('/setting/avatar', auth.requiresLogin, setting.avatar);
    app.post('/setting/avatar', auth.requiresLogin, setting.new_avatar);

    /// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}