var fs = require("fs"),
    sw = require('stopword');


let result = [];

readdir(result);

function readdir(result) {
    return new Promise((resolve, reject) => {
        fs.readdir("./data/pos", function (err, list) {
            if (err)
                reject("No Find Dir");

            resolve(filename(list, result));
        })
    })
}

async function readfile(name, result) {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/pos/" + name, function (err, json) {
            if (err)
                reject("no file");

            data = JSON.parse(json);
            result.push(data);
            
            resolve(result);

        })
    })
}



async function filename(list, result) {
    console.log(list);
    for (let i = 1; i < list.length; i++) {
        result = await readfile(list[i], result);
    }

    await next();

    function next() {
        console.log(result.length);

        const content = JSON.stringify(result);
        fs.writeFile("./data/pos/position.json", content, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    }
}