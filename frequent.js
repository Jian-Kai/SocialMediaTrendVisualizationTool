var fs = require("fs"),
  jieba = require('./server/jieba.js');


var getData = function getData(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, json) => {
      if (err) {
        reject(err);
      }
      //call cutword function
      resolve(cutword(JSON.parse(json).data));
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

var statistics = function statistics(data) {
  var wordtemp = []

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].word.length; j++) {
      if (data[i].word[j].weight > 12) {
        wordtemp.push({
          "word": data[i].word[j].word,
          "postid": i
        });
      }
    }
  }
  //console.log(wordtemp.length);
  return (wordtemp);
}

var count = function count(wordbuffer) {
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

  //fs.writeFile('./data/frequent.json', JSON.stringify({"key": exist}));
  return exist;
}

var link = function link(data) {
  var linkstruct = [];
 
  for(var i = 0 ; i < data.length; i++){
    if(data[i].count > 1){
      var key = data[i].posts;
      for(var j = 0; j < key.length - 1; j++){
        for(var k = j + 1; k < key.length; k++){
          linkstruct.push({
            "source": key[j],
            "target": key[k],
            "keyword": data[i].word
          });
        }
      }
    }
  }
  console.log("tatal link: " + linkstruct.length);
  //fs.writeFile('./data/link.json', JSON.stringify({"link": linkstruct}));
}

var context, word;

getData("./data/formatgreenpeace2016.json")
  .then((data) => {
    //console.log(data[2]);
    console.log("//////////////////");
    context = data;
    //console.log(word);
    return statistics(data);
  })
  .then((data) => {
    console.log("total word : " + data.length);
    console.log("total post : " + context.length);
    word = count(data);
    //console.log(word);

    return [context, word];
  })
  .then((data) => {
    link(data[1]);
  })
  .catch((error) => {
    console.log(error);
    return;
  });