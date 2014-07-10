var mongoose = require('mongoose'),
    utils = require('../lib/utils'),
    User = mongoose.model('User'),
    Blog = mongoose.model('Blog'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env],
    path = require('path'),
    fs = require('fs');

exports.list = function(req, res, next){
    Blog.list({user: req.user._id, delete: false},function (err, blogs) {
        if (err) return next(err);
        res.render('blog/list', {
            title: '家庭日记',
            blogs: utils.getStackBlogs(blogs),
            error: req.flash('error')
        });
    })
};

exports.new = function(req, res){
    res.render('blog/new', {
        subTitle: '新日记',
        blog: new Blog({})
    });
};

exports.create = function(req, res) {
    var blog = new Blog(req.body);
    blog.user = req.user;
    if (req.files.media) {
        blog.mediaURL = utils.getBlogUploadPath(config, req.files.media);
    }
    blog.save(function(err){
        if (err) return next(err);
        return res.json(200);
    });
};

exports.load = function(req, res, next, id){
    Blog.load(id, function (err, blog) {
        if (err) return next(err);
        if (!blog) return next(new Error('不存在此日记！'));
        req.blog = blog;
        next();
    })
};

exports.edit = function (req, res) {
    res.render('blog/edit', {
        subTitle: '修改日记',
        blog: req.blog
    })
};

exports.delete = function (req, res) {
    Blog.findByIdAndUpdate(req.blog._id, {delete: true}, function (err, blog) {
        if (err) return next(err);
        res.redirect('/')
    });
};

exports.update = function (req, res) {
    var update = {};
    update.body = req.body.body;
    if (req.files.media) {
        update.mediaURL = utils.getBlogUploadPath(config, req.files.media);
    }
    Blog.findByIdAndUpdate(req.blog._id, update, function (err, blog) {
        if (err) return next(err);
        return res.json(200);
    });
};