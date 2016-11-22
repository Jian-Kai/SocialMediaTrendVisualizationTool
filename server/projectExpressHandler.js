var async = require('async'), // npm install async
    fs = require('fs'),
    db = require('./db.js');

var callback = function callback(req, res) {

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "X-Requested-With");

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log("enter!!");
    console.log(ip);

    var action = req.query.action;

    console.log(action);
    //var data;
    db.find(function(err, res_posts){
      if(err || !res_posts){
        if(!res_posts){
			    			console.log("Err res_posts === null: ");
		    				console.dir(res_posts);
		    				//callback({"error": {"message": "No feed."}}, res_posts);
		    			}
		    			console.dir(err);
		    			res.send({"error": {"message": JSON.stringify(err)}});
      }
      else{
        console.log(res_posts.length);
        res.send(res_posts);
      }
    });
    //console.log(database_post.length);

}

var exports = module.exports = {};
exports.callback = callback;
