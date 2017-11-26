var express = require('express');
var path = require('path');

var config = require('./config.json');
var mongodb_client = require('./utils/mongodb_client').connect(config.mongodb_uri);

var app = express();

app.use('/static', express.static(path.join(__dirname, '../front/build/static')));

var bodyParser = require('body-parser');
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

var api = require('./routes/api');
app.use('/api', api);

app.get('*', function(req, res, next) {
    res.sendFile("index.html", {root: path.join(__dirname, '../front/build')} );
});

module.exports = app;
