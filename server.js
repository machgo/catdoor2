var express = require("express");
var bodyParser = require("body-parser");

var port = 8080;
var config = require("./config.js");

var app = express();
var mongoose = require('mongoose');
mongoose.connect("mongodb://mongo/catdoor-prod");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/api/door', bodyParser.json());
app.use('/api/events', bodyParser.json());
app.use('/api/uploads', function (req, res, next) {
    var data = new Buffer('');
    req.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', function () {
        req.rawBody = data;
        next();
    });
});

var router = express.Router();

var eventsRouter = require("./app/routes/events.js");
router.get('/events', eventsRouter.index);
router.get('/events/:event_id', eventsRouter.show);
router.post('/events', eventsRouter.create);
router.get('/uploads/:event_id', eventsRouter.getBinary);
router.post('/uploads/:event_id', eventsRouter.setBinary);

var doorRoutes = require("./app/routes/door.js");
router.get('/door', doorRoutes.show);
router.post('/door', doorRoutes.set);

app.use('/api', router);

//host static index-file
app.get('/', function (req, res) {
    res.sendFile('./public/index.html', {
        root: __dirname
    });
});

app.listen(port);