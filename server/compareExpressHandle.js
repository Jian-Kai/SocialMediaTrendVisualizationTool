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

    var fanpage = "fanpage_148475335184300";

    var type, fanpage_array = [];
    var posts = [],
        p;

    database.once('open', function (ref) {

        console.log("connect to mongo server!!");
        /*
        database.db.listCollections().toArray(function (err, name) {
            p = name.length;
            console.log("Find " + name.length + " Fanpage!");

            for (var i = 0; i < name.length; i++) {
                fanpage_array.push(name[i].name);
                
                var collection = database.collection(name[i].name);
                collection.find().toArray(function (err, datas) {
                    console.log(datas.length);
                    //res.send(datas);
                    jieba.cut(datas, function (err, result) {
                        Array.prototype.push.apply(posts, result);
                        next();
                    });
                })
            }
        })*/

        var collection = database.collection(fanpage);
        collection.find().toArray(function (err, datas) {
            console.log(datas.length + " posts");
            //res.send(datas);
            jieba.cut(datas, function (err, result) {
                res.send(result);
                database.close(function () {
                    console.log("Close DB");
                });

            });
        })

    });

    function next() {
        p--;
        console.log(p);
        if (p == 0) {
            res.send(posts);
            database.close(function () {
                console.log("Close DB");
            });
        }
    }
}

var exports = module.exports = {};
exports.callback = callback;