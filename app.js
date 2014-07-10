var debug = require('debug')('Orgrimar:server'),
    express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    utils = require('./lib/utils'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.db, options);
};

connect();

mongoose.connection.on('error', function (err) {
    console.log(err);
});

mongoose.connection.on('disconnected', function () {
    connect();
});

mongoose.connection.once('open', function () {
    debug('The %s connection is open at %s.', config.db, new Date);
});

fs.readdirSync(config.models_path).forEach(function (file) {
    if (utils.endsWith(file, '.js')){
        require(config.models_path + '/' + file);
        debug('Bootstrap model of %s:', file);
    }
});

var sessionStore = new MongoStore({
    db: config.sessionStore
});

require('./config/passport')(passport);

var app = express();

require('./config/express')(app, config, passport, sessionStore);

require('./config/routes')(app, passport);

module.exports = app;