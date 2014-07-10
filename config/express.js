var express = require('express'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    csrf = require('csurf'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    utils = require('../lib/utils');

module.exports = function (app, config, passport, sessionStore) {
    // Upload
    app.use(multer({
        dest: config.upload_tmp_path
    }));

    // view engine setup
    app.set('views', config.view_path);
    app.set('view engine', 'jade');

    app.use(favicon(config.favicon_path));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    }));
    app.use(methodOverride(function(req, res){
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
        }
    }));
    app.use(expressValidator());
    app.use(cookieParser());
    app.use(express.static(config.static_path));

    app.use(session({
        secret: config.cookie_secret
        , store: sessionStore
        , saveUninitialized: true
        , resave: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    // https://gist.github.com/tpblanke/11061808
    app.use(flash());
    // csrf
    app.use(csrf());
    app.use(function(req, res, next){
        res.locals.csrf_token = req.csrfToken();
        res.locals.path = req.path;
        res.locals.user = req.user;
        next();
    });
};