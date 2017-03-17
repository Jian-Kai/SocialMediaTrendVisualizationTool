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
    message: String,
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
                return;
            } else {
                console.log(datas.length);
                callback(null, datas);
                database.close();
            }
        })
    });
}

var save = function save(data, callback) {
  mongoose.connect('mongodb://localhost/FBDB');
  var database = mongoose.connection;
  //console.log(db);
  var type = mongoose.model('FBDB', object);
  database.on('error', console.error.bind(console, 'connection error:'));
  for(var i = 0; i < data.length; i++){
    var model = new type(data[i]);
    //model = data[i];
    //console.log(model);
    model.save(function(err){
      //console.log("save");
      if (err) console.error(err);
      else console.log("success");
    });
  }
  callback(null);
  database.close();
}

var remove = function remove(callback) {
    mongoose.connect('mongodb://140.119.164.25/FBDB');
    var database = mongoose.connection;
    var type = mongoose.model('FBDB', object);
    database.on('error', console.error.bind(console, 'connection error:'));
    database.once('open', function() {
        console.log("we're connected!");
        type.remove({}, function(err) {
            console.log('collection removed')
            database.close();
        });
    });
}

var exports = module.exports = {};
exports.object = object;
exports.find = find;
exports.save = save;
exports.remove = remove;
