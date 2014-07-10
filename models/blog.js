var utils = require('../lib/utils'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlogSchema = new Schema({
    hat: {type : Number, default : 0},
    body: {type : String, default : '', trim : true},
    user: {type : Schema.ObjectId, ref : 'User'},
    comments: [{
        body: { type : String, default : '' },
        user: { type : Schema.ObjectId, ref : 'User' },
        repost: { type : Boolean, default : false },
        createdAt: {type : Date, default : Date.now}
    }],
    tags: [{type : String}],
    likes: [{ type : Schema.ObjectId, ref : 'User' }],
    mediaURL: [{type : String}],
    createdAt: {type : Date, default : Date.now},
    delete: {type : Boolean, default : false}
});

BlogSchema.path('body').required(true, '日记文字内容不能为空！');

/***
 * Adds an instance method to documents constructed from Models compiled from this schema.
 * Methods
 */
BlogSchema.methods = {
    addComment: function (commenter, comment, cb) {
        this.comments.push({
            body: comment.body,
            user: commenter._id
        })

        this.save(cb)
    }
};

/***
 *  Adds static "class" methods to Models compiled from this schema.
 *  Statics
 */

BlogSchema.statics = {
    load: function (id, cb) {
        this.findById(id)
//            .populate('user')
//            .populate('likes')
            .exec(cb);
    },

    list: function (options, cb) {
        var criteria = options || {};

        this.find(criteria)
//            .populate('user')
            .sort({'createdAt': -1})
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }
};

mongoose.model('Blog', BlogSchema);
