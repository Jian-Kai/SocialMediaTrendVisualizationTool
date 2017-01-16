var async = require('async'),
    fs = require("fs"),
    graph = require("fbgraph"),
    db = require('./db.js');



graph.setVersion("2.6");

var callback = function callback(req, res) {
    var action = req.query.action;
    console.log(action);
    if (action == "first") {
        var postid = req.query.postid;
        var since = eliminateISOFormatTimeString(req.query.since);
        var until = eliminateISOFormatTimeString(req.query.until);
        var token = req.query.token;

        console.log(req.query.postid);
        console.log(req.query.token);
        console.log(since);
        console.log(until);

        var photo_id = 0;

        //query setting
        graph.setAccessToken(token);
        var field_query = "?fields=id,object_id,created_time,type,message,story,from,shares,reactions.limit(1).summary(true),comments.limit(1).summary(true)&since=" + since + "&until=" + until + "&limit=100";
        console.log(field_query);
        get_recursive(postid, "posts", field_query, 10, function(err, res_posts) {
            if (err || !res_posts) {
                if (!res_posts) {
                    console.log("Err res_posts === null: ");
                    console.dir(res_posts);
                    //callback({"error": {"message": "No feed."}}, res_posts);
                }
                console.dir(err);
                res.send({
                    "error": {
                        "message": JSON.stringify(err)
                    }
                });
            } else {
                res_posts.data = filter_information(res_posts.data);
                //console.log(res_posts.data);
                var p = 0, time = res_posts.data.length;
                console.log(time);
                  res_posts.data.forEach(function(post, index, array){
                    get_reactions(post.id, "?fields=reactions.type(LIKE).limit(0).summary(true).as(like),reactions.type(LOVE).limit(0).summary(true).as(love),reactions.type(WOW).limit(0).summary(true).as(wow),reactions.type(HAHA).limit(0).summary(true).as(haha),reactions.type(SAD).limit(0).summary(true).as(sad),reactions.type(ANGRY).limit(0).summary(true).as(angry)", post, function(err, result) {

                        //reactions.push(res_reaction);
                        //res_posts.data[i].reactions = res_reaction;
                        //console.log(i + ": reactions");
                        array[index] = result;
                    });

                    get_comments(post.id, "comments/?fields=from,like_count,message,comments,comment_count,created_time&limit=1000", 500, post, function(err, result) {
                        array[index] = result;
                        next();
                    });
                  });

                function next() {
                    p++;
                    console.log("p:" + p);
                    if (p === time) final();
                }
            }

            function final() {

                savejson(postid, res_posts);
                res.send(res_posts);
                var data = res_posts.data;
                /*db.save(data, function(err){
                  if(err){
                    console.dir(err);
                    res.send({"error": {"message": JSON.stringify(err)}});
                  }
                  else{
                      console.log("Save Success!!");
                  }
                })*/
                console.log("//////////////////////////////////////////////////////////////////////SAVE//////////////////////////////////////////////////////////////////////");

            }
        });
    }
    else {
        db.find(function(err, res_posts) {
            if (err || !res_posts) {
                if (!res_posts) {
                    console.log("Err res_posts === null: ");
                    console.dir(res_posts);
                    //callback({"error": {"message": "No feed."}}, res_posts);
                }
                console.dir(err);
                res.send({
                    "error": {
                        "message": JSON.stringify(err)
                    }
                });
            } else {
                console.log(res_posts.length);
                res.send(res_posts);
            }
        });
    }
}



var savejson = function savejson(name, jsondata) {
    var Today = new Date();
    var string = Today.getFullYear() + "-" + (Today.getMonth() + 1) + "-" + Today.getDate()
    fs.writeFile("./textdata/" + name + "-" + string + ".json", JSON.stringify(jsondata));
};

var save_photo_id = function save_photo_id(id) {
    photo_id = id;
    console.log("photo_id = " + photo_id);
};

var eliminateISOFormatTimeString = function eliminateISOFormatTimeString(ISOTimeString) {

    var dateArray = ISOTimeString.split("T"),
        YearMonthDay = dateArray[0],
        YearMonthDayArray = YearMonthDay.split(","),
        year = YearMonthDayArray[0],
        month = YearMonthDayArray[1],
        day = YearMonthDayArray[2];

    var date = year + "-" + month + "-" + day;

    return date;
};

function get_recursive(postid, field_query, subfield_query, MAX_DEPTH, callback) {

    graph.get(postid + '/' + field_query + '/' + subfield_query, function(err, res) {
        if (err || !res) {
            if (!res) {
                console.log("Error %s===null.", field_query);
                callback({
                    "error": {
                        "message": "No sharedpost."
                    }
                }, res);
            }
            callback(err, res);
            return res;
        }

        var recurpaging = function recurpaging(res, depth, MAX_DEPTH, callback) {

            if (depth >= MAX_DEPTH) {
                console.log("[resursive paging: MAX_DEPTH");
                console.log(field_query + ".length: " + data_query.data.length);
                //savejson("data_query", data_query);
                //console.log("data_query: " + data_query.data);
                return;
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
                //console.log("data_query: " + data_query.data.length);
                //console.log(data_query);
                callback(null, data_query);
                return;
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
        recurpaging(res, 1, MAX_DEPTH, callback);

        return;
    });
};

function get_reactions(postid, subfield_query, post, callback) {
    graph.get(postid + '/' + subfield_query, function(err, res) {
        if (err || !res) {
            if (!res) {
                console.log("Error %s===null.", field_query);
                callback({
                    "error": {
                        "message": "No sharedpost."
                    }
                }, res);
            }
            callback(err, res);
            return res;
        }
        //console.log(res);
        //console.log(post.likes);
        post.reactions = {
            "like": res.like.summary.total_count,
            "love": res.love.summary.total_count,
            "haha": res.haha.summary.total_count,
            "wow": res.wow.summary.total_count,
            "angry": res.angry.summary.total_count,
            "sad": res.sad.summary.total_count
        };
        callback(null, post);
        return;
    });
}

function get_comments(postid, subfield_query, MAX_DEPTH, post, callback) {
    graph.get(postid + '/' + subfield_query, function(err, res) {
        if (err || !res) {
            if (!res) {
                console.log("Error %s===null.", field_query);
                callback({
                    "error": {
                        "message": "No sharedpost."
                    }
                }, res);
            }
            callback(err, res);
            return res;
        }

        var recurpaging = function recurpaging(res, depth, MAX_DEPTH, callback) {

            if (depth >= MAX_DEPTH) {
                console.log("[resursive paging: MAX_DEPTH");
                console.log("comments" + ".length: " + data_query.data.length);
                //savejson("data_query", data_query);
                //console.log("data_query: " + data_query.data);
                return;
            }

            if (res.data && res.paging && res.paging.next) {
                graph.get(res.paging.next, function(err, res) {
                    if (err) {
                        callback(err, res);
                    }
                    // page depth
                    depth++;
                    //console.log(res);
                    console.log("page " + depth + " " + "comments" + ".length: " + res.data.length);

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
                console.log("comments" + ".length: " + data_query.data.length);
                post.comments.context = data_query.data;
                //console.log(post.comments.context.length)
                  var x = post.comments.context.length
                  console.log(x);
                  //console.log(post.comments.context[0]);

                  if(post.comments.context.length > 0){
                    for(var i in post.comments.context){
                      //console.log("out" + i);
                      get_next(post.comments.context[i], i,function(err, result, index){
                        //console.log(result);
                        //console.log("in" + i);
                          post.comments.context[index] = result;
                          //console.log(post.comments.context[i]);
                          next();                      //that.comments.data.push.apply(that.comments.data, result.data);
                      });
                    }
                  }
                  else{
                    callback(null,post);
                  }

                function next() {
                    x--;
                    console.log("x:" + x);
                    if (x === 0) final();
                }

                function final(){
                  callback(null,post);
                }
                //callback(null,post);
                return;
            }
        };

        //console.log(res);
        //console.log(res.data);
        //console.log("res.data.length: " + res.data.length );
        var data_query = {
            "data": []
        };

        if (res.data) {
            data_query.data = res.data; //data_query.data.concat(res.data);
            console.log("page " + 1 + " " + "comments" + ".length: " + data_query.data.length);
            recurpaging(res, 1, MAX_DEPTH, callback);
        } else {
            post.comments.context = null;
            callback(null, post);
        }

        return;
    });
}

var get_next = function get_next(next, index, callback){
  if(next.comment_count > 0){
    console.log(next.id);
    if("comments" in next){
      if("paging" in next.comments){
        if("next" in next.comments.paging){
          graph.get(next.comments.paging.next, function(err, result){
            next.comments.data.push.apply(next.comments.data, result.data);
            callback(null, next, index);
          });
        }
        else {
          //console.log(next);
          callback(null, next, index);
        }
      }
      else {
        //console.log(next);
        callback(null, next, index);
      }
    }
    else {
      //console.log(next);
      callback(null, next, index);
    }
  }
  else {
    //console.log(next);
    callback(null, next, index);
  }
}

function filter_information(postdata) {
    console.log("posts length : " + postdata.length);

    var data, result = [];

    for (var i = 0; i < postdata.length; i++) {
        if (postdata[i].created_time) {
            if (postdata[i].shares) {
                data = {
                    "id": postdata[i].id,
                    "object_id": postdata[i].object_id,
                    "created_time": postdata[i].created_time,
                    "type": postdata[i].type,
                    "from": postdata[i].from,
                    "shares": postdata[i].shares.count,
                    "likes": postdata[i].reactions.summary.total_count,
                    "reactions": null,
                    "comments": {
                        "context": null,
                        "summary": postdata[i].comments.summary.total_count
                    }
                };
            } else {
                data = {
                    "id": postdata[i].id,
                    "object_id": postdata[i].object_id,
                    "created_time": postdata[i].created_time,
                    "type": postdata[i].type,
                    "from": postdata[i].from,
                    "shares": 0,
                    "likes": postdata[i].reactions.summary.total_count,
                    "reactions": null,
                    "comments": {
                        "context": null,
                        "summary": postdata[i].comments.summary.total_count
                    }
                };
            }

        } else {
            if (postdata[i].shares) {
                data = {
                    "id": postdata[i].id,
                    "object_id": postdata[i].object_id,
                    "created_time": postdata[i].updated_time,
                    "type": postdata[i].type,
                    "from": postdata[i].from,
                    "shares": postdata[i].shares.count,
                    "likes": postdata[i].reactions.summary.total_count,
                    "reactions": null,
                    "comments": {
                        "context": null,
                        "summary": postdata[i].comments.summary.total_count
                    }
                };
            } else {
                data = {
                    "id": postdata[i].id,
                    "object_id": postdata[i].object_id,
                    "created_time": postdata[i].updated_time,
                    "type": postdata[i].type,
                    "from": postdata[i].from,
                    "shares": 0,
                    "likes": postdata[i].reactions.summary.total_count,
                    "reactions": null,
                    "comments": {
                        "context": null,
                        "summary": postdata[i].comments.summary.total_count
                    }
                };
            }
        }
        result.push(data);
    }

    return result;
}


var exports = module.exports = {};
exports.callback = callback;
