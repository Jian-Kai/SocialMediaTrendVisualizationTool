// import modules
var express = require('express'), // npm install express
    app = express(),
    async = require('async'),
    fs = require("fs"),
    projectExpressHandler = require('./server/projectExpressHandler.js'),
    crawlerExpressHandler = require('./server/crawlerExpressHandler.js');
    


app.get('/text', crawlerExpressHandler.callback);

app.get('/index', function(req, res) {
    console.log("hello");
});

app.get('/project', projectExpressHandler.callback);

app.get('/sunburst', function(req, res) {
    console.log("hello");
});



var port = process.env.PORT || 4000;

app.listen(port, function() {
    console.log("Express server listening on port %d", port);
});

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/html/'));

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});
