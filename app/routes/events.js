var Event = require('../models/event');

exports.index = function (req, res, next) {
    Event.find(function (err, events) {
        if (err)
            res.send(err);
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