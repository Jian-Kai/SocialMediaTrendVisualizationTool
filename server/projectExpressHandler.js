var async 					= require('async'), 				// npm install async
 		fs 							= require('fs');

var callback = function callback(req, res){

    res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "X-Requested-With");

		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		console.log("enter!!");
		console.log(ip);

    var stack = req.query.stack;

    console.log(stack);

    res.send("success");
}

var exports = module.exports = {};
exports.callback = callback;
