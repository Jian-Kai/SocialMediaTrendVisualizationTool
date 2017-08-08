var fs = fs = require("fs"),
    jieba = require('./jieba.js');


var callback = function callback(req, res) {
    var action = req.query.action;
    console.log(action);

    var data;
    var name = "formatgreenpeace2016";
    //var name = "HBKdata";

    fs.readFile("./data/" + name + ".json", function (err, json) {
        if (err) throw err;

        data = JSON.parse(json).data;

        console.log(data.length + " posts");

        jieba.cut(data, function (err, result) {
            console.log("////////////////////////////////////////")
            res.send(result);
        });
    })
}


var exports = module.exports = {};
exports.callback = callback;