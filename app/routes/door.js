var Door = require('../models/door.js');

exports.show = function (req, res, next) {
    Door.findOne(function (err, door) {
    if (err)
        res.send(err);
    res.json(door);
    });
};

exports.set = function (req, res, next) {
    
};