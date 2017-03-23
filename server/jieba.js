var nodejieba = require("nodejieba");

var cut = function cut(posts, callback) {
    var data = posts;
    nodejieba.load({
        dict: nodejieba.DEFAULT_DICT,
        hmmDict: nodejieba.DEFAULT_HMM_DICT,
        userDict: '',
        idfDict: nodejieba.DEFAULT_IDF_DICT,
        stopWordDict: nodejieba.DEFAULT_STOP_WORD_DICT,
    });
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？ ↵「」]");
    console.log(pattern);

    for (var i = 0; i < posts.length; i++) {
        var temp = posts[i].message;
        var str = "";
        for (var j = 0; j < temp.length; j++) {
            str += temp.substr(j, 1).replace(pattern, "");
        }
        //temp = temp.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,'');
        posts[i].message_length = str.length;
        str = nodejieba.cut(str, false);
        posts[i].word = str;
    }
    callback(null, posts);
    console.log("cut the messages!!");
}


var exports = module.exports = {};
exports.cut = cut;