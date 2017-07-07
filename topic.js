var fs = require("fs"),
    jieba = require('./server/jieba.js');

let psots;

var context, word;

var getData = function getData(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, json) => {
            if (err) {
                reject(err);
            }
            //call cutword function
            var result = JSON.parse(json).data;
            resolve(cutword(result));
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

var interate = function interate(data) {
    var month = [],
        wordfrequent = [];
    for (var i = 0; i < 12; i++) {
        month[i] = [];
        wordfrequent[i] = [];
    }

    for (var i = 0; i < data.length; i++) {
        var index = new Date(data[i].created_time).getMonth();
        month[index].push({
            "word": data[i].word,
            "created_time": data[i].created_time,
            "postid": data[i].id,
            "comments": data[i].comments.summary
        });
    }
    //count(month[7]);
    //console.log(month[0]);

    fs.writeFile('./data/aug_post.json', JSON.stringify({
        "data": month[7]
    }));

    console.log("12Month");

    return count(month[7]);
}

var count = function count(month_data) {

    var wordbuffer = [];
    context = month_data;
    for (var i = 0; i < month_data.length; i++) {
        for (var j = 0; j < month_data[i].word.length; j++) {
            if (month_data[i].word[j].weight > 12) {
                wordbuffer.push({
                    "word": month_data[i].word[j].word,
                    "postid": i
                });
            }
        }
    }

    console.log("wordbuffer");
    var exist = [],
        buffer = [],
        c = 0;
    for (var i = 0; i < wordbuffer.length; i++) {
        if (buffer[wordbuffer[i].word] == null) {
            buffer[wordbuffer[i].word] = c;
            c++;
            exist.push({
                "word": wordbuffer[i].word,
                "count": 1,
                "posts": [wordbuffer[i].postid]
            });
        } else {
            exist[buffer[wordbuffer[i].word]].count++;
            exist[buffer[wordbuffer[i].word]].posts.push(wordbuffer[i].postid);
        }
    }
    //console.log(exist);

    fs.writeFile('./data/aug_word.json', JSON.stringify({
        "key": exist
    }));
    return exist;
}

var link = function link(data, post) {
    var linkstruct = [];

    

    var monday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (var i = 0; i < data.length; i++) {
        if (data[i].count > 1) {
            var key = data[i].posts;
            for (var j = 0; j < key.length; j++) {
                for (var k = 0; k < key.length; k++) {
                    var sourcetime = new Date(post[key[j]].created_time).getMonth(),
                        targettime = new Date(post[key[k]].created_time).getMonth();

                    if (sourcetime == targettime) {
                        var inweek = Math.abs(new Date(post[key[j]].created_time).getDate() - new Date(post[key[k]].created_time).getDate());
                        if (0 <= inweek && inweek <= 7) {
                            if (new Date(post[key[j]].created_time).getTime() < new Date(post[key[k]].created_time).getTime()) {
                                linkstruct.push({
                                    "source": key[j],
                                    "target": key[k],
                                    "keyword": data[i].word
                                });
                            }
                        }
                    } else if ((targettime - sourcetime) == 1) {
                        if ((monday[sourcetime] - new Date(post[key[j]].created_time).getDate() + new Date(post[key[k]].created_time).getDate()) <= 7) {
                            linkstruct.push({
                                "source": key[j],
                                "target": key[k],
                                "keyword": data[i].word
                            });
                        }
                    }


                    /*
                    if (sourcetime < targettime && Math.abs(targettime - sourcetime) == 1) {
                      linkstruct.push({
                        "source": key[j],
                        "target": key[k],
                        "keyword": data[i].word
                      });
                    }
                    */

                }
            }
        }
    }
    console.log("tatal link: " + linkstruct.length);
    /*
    fs.writeFile('./data/link.json', JSON.stringify({
        "link": linkstruct
    }));
    */
    return linkstruct;
}

var filter = function filter(link) {
    console.log("filter");
    var Afilter = [{
        "source": link[0].source,
        "target": link[0].target,
        "keyword": [link[0].keyword]
    }];
    //console.log(Afilter);
    for (var i = 1; i < link.length; i++) {
        var temp = link[i];
        var add = true,
            index;
        for (var j = 0; j < Afilter.length; j++) {
            var temp2 = Afilter[j];
            if (temp.source == temp2.source && temp.target == temp2.target) {
                index = j;
                add = false;
            } else if (temp.source == temp2.target && temp.target == temp2.source) {
                index = j;
                add = false;
            }
        }
        if (add) {
            Afilter.push({
                "source": temp.source,
                "target": temp.target,
                "keyword": [temp.keyword]
            })
        } else {
            Afilter[index].keyword.push(temp.keyword);
        }
    }


    fs.writeFile('./data/aug_filter.json', JSON.stringify({
        "link": Afilter 
    }));

    console.log("done");
}



getData("./data/formatgreenpeace2016.json")
    .then((data) => {
        //console.log(data);
        console.log("//////////////////");
        posts = data.sort(function (a, b) {
            return new Date(a.created_time) - new Date(b.created_time);
        });
        //console.log(word);
        return interate(posts)
    })
    .then((data) => {
        //console.log(data);
        word = data;
        return [context, word];
    })
    .then((data) => {
        var linkstruct = link(data[1], data[0]);
        filter(linkstruct);
    })
    .catch((error) => {
        console.log(error);
        return;
    });