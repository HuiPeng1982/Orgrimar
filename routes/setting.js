var mongoose = require('mongoose'),
    utils = require('../lib/utils'),
    User = mongoose.model('User'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env];

exports.avatar = function(req, res){
    res.render('setting/avatar', {
        subTitle: '头像设置'
    });
};

exports.new_avatar = function(req, res, next){
    req.user.avatar = utils.getUploadPath(config, req.files.avatar);
    req.user.save(function(err){
        if (err) return next(err);
        return res.json(200);
    });
}