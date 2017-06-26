var fs = require("fs"),
    jieba = require('./server/jieba.js');


var getData = function getData(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, json) => {
            if (err) {
                reject(err);
            }
            //call cutword function
            var result = JSON.parse(json).key;
            resolve((result));
        })
    });
}

var cutword = function cutword(data) {
    return new Promise((resolve, reject) => {
        jieba.cut(data, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    });
}


getData("./data/frequent.json")
    .then((data) => {
        console.log(data);
        console.log("//////////////////");
        //console.log(word);
        return (data);
    })
    .catch((error) => {
        console.log(error);
        return;
    });