var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto');

var UserSchema = new Schema({
    email: {type: String, default: ''}
    , hashed_password: {type: String, default: ''}
    , salt: {type: String, required: true, unique: true, default: ''}
    , activateDate: {type: Date }
    , avatar: {type: String, default: ''}
    , kid: [{type : Schema.ObjectId, ref : 'Kid'}]
});

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

UserSchema.path('email').validate(function (email) {
    return email.length;
}, 'Email地址不能为空！');

UserSchema.path('email').validate(function (email, fn) {
    var User = mongoose.model('User');

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else { fn(true); }
}, 'Email地址已经存在！');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    return hashed_password.length;
}, '密码不能为空！');

UserSchema.pre('save', function(next) {
    next();
});

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())).toString();
    },

    encryptPassword: function (password) {
        if (!password) { return ''; }
        var encrypred;
        try {
            encrypred = crypto.createHmac('sha1', this.salt)
                .update(password).digest('hex');
            return encrypred;
        } catch (err) {
            return '';
        }
    }
};

mongoose.model('User', UserSchema);