var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/catdoor2');

var port = process.env.PORT || 8080;        // set our port

var pictures = require('./routes/picture');

app.use('/api', pictures);

app.listen(port);
console.log('Magic happens on port ' + port);

