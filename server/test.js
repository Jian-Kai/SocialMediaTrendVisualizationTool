var async = require('async'),
    fs = require("fs"),
    graph = require("fbgraph"),
    db = require('./db.js'),
    jieba = require('./jieba.js');


var callback = function callback(req, res) {
    var action = req.query.action;
    console.log(action);
    db.find(null, function (err, res_posts) {
        if (err || !res_posts) {
            if (!res_posts) {
                console.log("Err res_posts === null: ");
                console.dir(res_posts);
                //callback({"error": {"message": "No feed."}}, res_posts);
            }
            console.dir(err);
            res.send({
                "error": {
                    "message": JSON.stringify(err)
                }
            });
        } else {
            var data = res_posts;
            console.log(res_posts.length);
            jieba.cut(res_posts, function (err, result) {
                res.send(result);

            });

        }
    });
}


var exports = module.exports = {};
exports.callback = callback;