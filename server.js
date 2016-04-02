var express = require("express");

var port = process.env.PORT || 8080;
var config = require("./config.js");

var app = express();
var mongoose = require('mongoose');
mongoose.connect(config.db[process.env.NODE_ENV]);

var router = express.Router();
router.use(function (req, res, next) {
    console.log("received...");
    console.log(req.body);
    next();
});

var picturesRoutes = require("./app/routes/pictures.js");
router.get('/pictures', picturesRoutes.index);
router.get('/pictures/:picture_id', picturesRoutes.show);
router.post('/pictures', picturesRoutes.create);
router.get('/upload/:picture_id', picturesRoutes.getBinary);
router.post('/upload/:picture_id', picturesRoutes.setBinary);

var doorRoutes = require("./app/routes/door.js");
router.get('/door', doorRoutes.show);

app.use('/api', router);
app.get('/', function (req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});
app.listen(port);