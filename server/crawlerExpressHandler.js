async = require('async'),
    fs = require("fs"),
    graph = require("fbgraph");

var savejson = function savejson(name, jsondata) {
    var Today = new Date();
    var string = Today.getFullYear()+ "-" + (Today.getMonth()+1) + "-" + Today.getDate()
    fs.writeFile("./textdata/" + name + "-" + string + ".json", JSON.stringify(jsondata));
};

var save_photo_id = function save_photo_id(id) {
    photo_id = id;
    console.log("photo_id = " + photo_id);
};

var callback = function callback(req, res) {
    var postid = req.query.postid;
    var token = req.query.token;

    console.log(req.query.postid);
    console.log(req.query.token);

    var photo_id = 0;

    //query setting
    graph.setAccessToken(token)
    var field_query = "?fields=id,object_id,type,message,story,from,shares,likes.limit(1).summary(true),comments.limit(1).summary(true)&since=2016-09-23&until=2016-10-25&limit=100";

    graph.get('/' + postid + '/posts' + field_query, function(err, res) {

        if (err || !res) {
            if (!res) {
                console.log("Error %s===null.", field_query);
                callback({
                    "error": {
                        "message": "No sharedpost."
                    }
                }, res);
            }
            //callback(err, res);
            return res;
        }

        var recurpaging = function recurpaging(res, depth, MAX_DEPTH, callback) {
            
            if (depth >= MAX_DEPTH) {
                console.log("[resursive paging: MAX_DEPTH");
                console.log(field_query + ".length: " + data_query.data.length);
                //savejson("data_query", data_query);
                //console.log("data_query: " + data_query.data);
                return ;
            }

            if (res.data && res.paging && res.paging.next) {
                graph.get(res.paging.next, function(err, res) {
                    if (err) {
                        callback(err, res);
                    }
                    // page depth
                    depth++;
                    //console.log(res);
                    console.log("page " + depth + " " + field_query + ".length: " + res.data.length);

                    //data_query.data = data_query.data.concat(res.data);
                    data_query.data.push.apply(data_query.data, res.data);

                    //console.log("data_query: " + data_query.data );
                    //savejson("data_query", data_query);

                    setTimeout(function() {
                        recurpaging(res, depth, MAX_DEPTH, callback);
                    }, 2000);
                });
            } else {
                console.log("[resursive paging: end --------------]");
                console.log(field_query + ".length: " + data_query.data.length);
                //savejson("data_query", data_query);
                console.log("data_query: " + data_query.data.length );
                //console.log(data_query);
                savejson(postid,data_query);
                return ;
            }
        };

        //console.log(res);
        //console.log(res.data);
        //console.log("res.data.length: " + res.data.length );
        var data_query = {
            "data": []
        };
        data_query.data = res.data; //data_query.data.concat(res.data);
        console.log("page " + 1 + " " + field_query + ".length: " + data_query.data.length);
        recurpaging(res, 1, 10, callback);

        return ;
    });


}


var exports = module.exports = {};
exports.callback = callback;
