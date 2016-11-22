var mongo = require('mongodb'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var object = mongoose.Schema({
    id: String,
    created_time: String,
    type: String,
    from: {
        name: String,
        id: String
    },
    shares: Number,
    likes: Number,
    reactions: {
        like: Number,
        love: Number,
        haha: Number,
        wow: Number,
        angry: Number,
        sad: Number
    },
    comments: {
        context: [{
            created_time: String,
            from: {
                name: String,
                id: String
            },
            message: String,
            id: String
        }],
        summary: Number
    }
});

var find = function find(callback) {

    mongoose.connect('mongodb://localhost/FBDB');
    var database = mongoose.connection;
    var type = mongoose.model('FBDB', object);
    database.on('error', console.error.bind(console, 'connection error:'));
    database.once('open', function() {
        console.log("we're connected!");
        type.find(function(err, datas) {
            if (err) {
              console.log(err);
              return ;
            }
            else {
                console.log(datas.length);
                callback(null, datas);
            }
        })
    });

}

var exports = module.exports = {};
exports.object = object;
exports.find = find;
