var fs = require("fs"),
    sw = require('stopword');

fs.readFile("./data/CNN&Reuters/" + "CNN.json", function (err, json) {
    if (err) throw err;

    data = JSON.parse(json).data;
    let result = [];
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

        result.push({
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

    //console.log(result);

})