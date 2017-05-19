var mongo = require('mongodb'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    mongoose.Promise = global.Promise;

    var options = { 
    server: { 
        socketOptions: { 
            keepAlive: 1,
            connectTimeoutMS: 3000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS : 3000
        } 
    } 
};

    mongoose.connect('mongodb://locahost',function(err){
        if(err){
            throw  err;
        }
    });