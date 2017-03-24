var nodejieba = require("nodejieba");

var cut = function cut(posts, callback) {
    var data = posts;
    var result = [];
    nodejieba.load({
        dict: nodejieba.DEFAULT_DICT,
        hmmDict: nodejieba.DEFAULT_HMM_DICT,
        userDict: '',
        idfDict: nodejieba.DEFAULT_IDF_DICT,
        stopWordDict: nodejieba.DEFAULT_STOP_WORD_DICT,
    });
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？ ↵「」]");
    console.log(pattern);
    var p = 0, time = posts.length;
    for (var i = 0; i < posts.length; i++) {
        var temp = data[i].message;
        var str = "";
        for (var j = 0; j < temp.length; j++) {
            str += temp.substr(j, 1).replace(pattern, "");
        }
        //temp = temp.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,'');
        var message_length = str.length;
        str = nodejieba.cut(str, false);
        var word = str;
        result.push({
                    "id": data[i].id,
                    "object_id": data[i].object_id,
                    "created_time": data[i].updated_time,
                    "type": data[i].type,
                    "message": data[i].message,
                    "from": data[i].from,
                    "shares": data[i].shares,
                    "likes": data[i].likes,
                    "reactions": data[i].reactions,
                    "comments": data[i].comments,
                    "message_length": message_length,
                    "word": word
        });
        next();
    }
    
    function next(){
        p++;
        if (p === time) {
            final();
        }
    }

    function final() {
        console.log("cut the messages!!");
        console.log(result[0]);
        callback(null, result);
    }
}




var exports = module.exports = {};
exports.cut = cut;