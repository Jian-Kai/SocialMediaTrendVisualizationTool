var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db('FBDb', mongodbServer);



function openDB(detial){
  db.open(function(err, db) {
    if(!err){
      console.log("connect!!");
      console.log(detial);
    }
    else{
      console.log("Fail!!");
      console.log(err);
    }
  });
}


var exports = module.exports = {};
exports.openDB = openDB;
