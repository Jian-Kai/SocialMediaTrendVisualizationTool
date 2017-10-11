var fs = fs = require("fs"),
    sw = require('stopword'),
    async = require('async'),
    jieba = require('./jieba.js');


var callback = function callback(req, res) {
    var action = req.query.action;
    console.log(action);

    var data;
    if (action === "first") {
        console.log( req.query.fanpage)
        var name;
        if(req.query.fanpage != "undefined"){
            name = req.query.fanpage;
        }
        else{
            name = "formatgreenpeace2016";
        }
        
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
    } else if (action === "second") {
        let result = {
            "fanpage": ["CNN International", "Reuters"],
            "data": []
        };

        send(result)

    }

    async function send(result){

       await readdir(result);
       
    }

    function readdir(result) {
        return new Promise((resolve, reject) => {
            fs.readdir("./data/CNN&Reuters", function (err, list) {
                if (err)
                    reject("No Find Dir");

                resolve(filename(list, result));
            })
        })
    }

    async function readfile(name, result) {
        return new Promise((resolve, reject) => {
            fs.readFile("./data/CNN&Reuters/" + name, function (err, json) {
                if (err)
                    reject("no file");

                data = JSON.parse(json).data;

                console.log(data.length + " posts");
                for (let i = 0; i < data.length; i++) {
                        var message = data[i].message.split(' ');
                        for (let j = 0; j < message.length; j++) {
                            if (message[j].slice(0, 4) !== "http")
                                message[j] = message[j].replace(/\W|_/g, '');
                        }
                        //console.log(message);
                        var word = sw.removeStopwords(message);
                        //console.log(word);
    
                        result.data.push({
                            "id": data[i].id,
                            "created_time": data[i].created_time,
                            "type": data[i].type,
                            "message": data[i].message,
                            "from": data[i].from,
                            "shares": data[i].shares,
                            "likes": data[i].reactions.like + data[i].reactions.love + data[i].reactions.haha + data[i].reactions.wow + data[i].reactions.sad + data[i].reactions.angry,
                            "reactions": data[i].reactions,
                            "comments": data[i].comments,
                            "message_length": message.length,
                            "word": word
                        });
                                   

                }
                resolve(result);

            })
            

        })
    }

    async function filename(list, result) {

        for (let i = 0; i < list.length; i++) {
            result = await readfile(list[i], result);
        }

        await next();

        function next(){
            //console.log(result.data.length);
            res.send(result);
        }
    }

}


var exports = module.exports = {};
exports.callback = callback;