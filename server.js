var express = require("express");
var bodyParser = require("body-parser");

var port = process.env.PORT || 8080;
var config = require("./config.js");

var app = express();
var mongoose = require('mongoose');
mongoose.connect(config.db[process.env.NODE_ENV]);

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/door', bodyParser.json());
app.use('/api/pictures', bodyParser.json());
app.use('/api/upload', function(req, res, next) {
    var data = new Buffer('');
    req.on('data', function(chunk) {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
});


var router = express.Router();

var picturesRoutes = require("./app/routes/pictures.js");
router.get('/pictures', picturesRoutes.index);
router.get('/pictures/:picture_id', picturesRoutes.show);
router.post('/pictures', picturesRoutes.create);
router.get('/upload/:picture_id', picturesRoutes.getBinary);
router.post('/upload/:picture_id', picturesRoutes.setBinary);

var doorRoutes = require("./app/routes/door.js");
router.get('/door', doorRoutes.show);
router.post('/door', doorRoutes.set);

app.use('/api', router);

//host static index-file
app.get('/', function (req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

app.listen(port);