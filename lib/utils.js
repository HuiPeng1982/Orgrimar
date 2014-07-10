exports.getErrors = function (errors) {
    var keys = Object.keys(errors);
    var errs = [];

    // if there is no validation error, just display a generic error
    if (!keys) {
        throw new Error('调用helper.getErrors方法时，传入非法Passport errors!');
    }

    keys.forEach(function (key) {
        errs.push(errors[key].message);
    });

    return errs;
};

exports.getValidationErrors = function (validationErrors) {
    var errs = [];

    // if there is no validation error, just display a generic error
    if (!validationErrors) {
        throw new Error('调用helper.getValidationErrors，传入非法validationErrors!');
    }

    validationErrors.forEach(function (err) {
        errs.push(err.msg);
    });

    return errs;
};

exports.getCreateDateFromId = function (id) {
    if (!id || id.length != 24) {
        throw new Error('调用helper.getCreateDateFromId方法时，传入非法MongoDB _id!');
    }

    return new Date( parseInt( id.toString().substring(0,8), 16 ) * 1000 );
};

exports.endsWith = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

exports.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.getStackBlogs = function(blogs){
    var stackBlogs = [[],[],[]];
    var index = 0;
    blogs.forEach(function (blog){
        stackBlogs[index++].push(blog);
        if(index === 3){
            index = 0;
        }
    });
    return stackBlogs;
};

exports.getLocalDate = function(date){
    var df = new SimpleDateFormat();
    df.applyPattern("yyyy-MM-dd HH:mm:ss");
    return df.format(date);
};

exports.getBlogUploadPath = function(config, data){
    var mediaURL = [];
    if(data instanceof Array){
        data.forEach(function(d){
            mediaURL.push(d.path.replace(config.upload_tmp_path, '/uploads'));
        });
    }else{
        mediaURL.push(data.path.replace(config.upload_tmp_path, '/uploads'));
    }
    return mediaURL;
};

exports.getUploadPath = function(config, data){
    return data.path.replace(config.upload_tmp_path, '/uploads')
};