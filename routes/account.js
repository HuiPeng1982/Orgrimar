var mongoose = require('mongoose'),
    utils = require('../lib/utils'),
    User = mongoose.model('User');

exports.login = function(req, res){
    res.render('account/login', {
        title: '登录',
        error: req.flash('error')
    });
};

exports.register = function(req, res){
    res.render('account/register', {
        title: '注册',
        user: new User(),
        error: req.flash('error')
    });
};

exports.logout = function(req, res){
    req.logout();
    res.redirect('/login');
};

exports.signup = function(req, res){
    req.checkBody('email', '请输入有效的电子邮件').isEmail();
    req.checkBody('password', '密码最少5个字').isLength(5);
    var validationErrors = req.validationErrors();

    if (validationErrors) {
        req.flash('error', utils.getValidationErrors(validationErrors));
        return res.redirect('/register');
    }

    var user = new User(req.body);
    user.save(function (err) {
        if (err) {
            req.flash('error', utils.getErrors(err.errors));
            return res.redirect('/register');
        }
        return res.redirect('/login');
    });
};