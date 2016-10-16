var Event = require('../models/event');

exports.index = function (req, res, next) {
    Event.find().sort({
        created_at: -1
    }).exec(function (err, events) {
        if (err)
            res.send(err);
        for (var i = 0; i < events.length; i++) {
            var element = events[i];
            if (element.data !== null) {
                element.has_data = true
            } else {
                element.has_data = false;
            }
        }
        console.log(events);
        res.json(events);
    });
};

exports.show = function (req, res, next) {
    Event.findById(req.params.event_id, function (err, event) {
        if (err)
            res.send(err);
        res.json(event)
    });
};

exports.create = function (req, res, next) {
    var event = new Event();
    event.name = req.body.name;
    event.sender = req.body.sender;
    event.created_at = new Date();
    event.data = null;
    event.has_data = false;

    event.save(function (err) {
        if (err)
            res.send(err);
        res.json(event);
    });
};

exports.setBinary = function (req, res, next) {
    var buf = req.rawBody;
    Event.findById(req.params.event_id, function (err, event) {
        if (err)
            res.send(err);
        event.data = buf;
        event.has_data = true;
        event.save(function (err) {
            if (err)
                res.send(err);
            res.sendStatus(200);
        });
    });
};

exports.getBinary = function (req, res, next) {
    Event.findById(req.params.event_id, function (err, event) {
        if (err)
            res.send(err);
        res.contentType("image/png");
        res.send(event.data);
    });
};