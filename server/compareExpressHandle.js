var mongo = require('mongodb'),
    mongoose = require('mongoose'),
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

    var fanpage = "fanpage_136845026417486";

    //var type = mongoose.model('FBDB', object);

    var type;
    
    database.on('open', function(ref){
        console.log("connect to mongo server!!");

        database.db.listCollections().toArray(function(err, name){
            console.log(name.length);
        })
    })


    /*
    if (mongoose.models[fanpage]) {
        console.log("Find Fanpage");
        type = mongoose.model(fanpage);
    } else {
        console.log("Fanpage No Find!!");
        res.send("Fanpage No Find!!");
        return;
    }
    */


    

    
/*
    type.find(function (err, datas) {
        if (err) {
            console.log(err);
            database.close();
            return;
        } else {
            console.log("Find " + datas.length + " Posts");
            //callback(null, result);
            jieba.cut(datas, function (err, result) {
                res.send(result);
            });
            database.close(function(){
                console.log("DB Colsed");
            });
        }
    })*/
}

var exports = module.exports = {};
exports.callback = callback;