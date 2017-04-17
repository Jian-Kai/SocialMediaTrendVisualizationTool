var mongo = require('mongodb'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    jieba = require('./jieba.js');

var callback = function callbabck(req, res) {

    var action = req.query.action;
    console.log(action);

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://140.119.164.166/FBDB');
    var database = mongoose.connection;
    /*
    mongoose.Schema({
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
          reactions:{
            like: Number,
            love: Number,
            haha: Number,
            wow: Number,
            angry: Number,
            sad: Number,
          },
          comments:{
            context: Object,
            summary: Number
          },
          attachments: Object
      });
      */

    var fanpage = "fanpage_148475335184300";

    //var type = mongoose.model('FBDB', object);

    var type;

    database.on('open', function (ref) {
        console.log("connect to mongo server!!");

        var collection = database.collection(fanpage);
        collection.find().toArray(function (err, datas) {
            console.log(datas.length);
            //res.send(datas);
           jieba.cut(datas, function (err, result) {

                res.send(result);
                database.close(function () {
                    console.log("Close DB");
                });

            });
        })
    });
}

var exports = module.exports = {};
exports.callback = callback;