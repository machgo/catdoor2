var Door = require('../models/door.js');

exports.show = function (req, res, next) {
    Door.findOne(function (err, door) {
        if (err)
            res.send(err);
        console.log(door);
        res.json(door);
    });
};

exports.set = function (req, res, next) {
    Door.findOne(function (err, door) {
        if (err)
            res.send(err);

        // only first request if there's no door already defined.
        if (door == null) {
            var door = new Door();
            door.unlocked = false;
            door.save(function (err) {
                if (err)
                    res.send(err);
                res.json({
                    message: 'Door created..'
                });
            });
        } else {
            door.unlocked = req.body.unlocked;
            console.log(req.body);
            door.save(function (err) {
                if (err)
                    res.send(err);
                res.json({
                    message: 'Door changed..'
                });
            });
        }
    });
};