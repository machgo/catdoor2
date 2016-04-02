var Picture = require('../models/picture');

exports.index = function (req, res, next) {
    Picture.find(function (err, pictures) {
        if (err)
            res.send(err);
        res.json(pictures);
    }); 
};

exports.show = function (req, res, next) {
    Picture.findById(req.params.picture_id, function (err, picture) {
    if (err)
        res.send(err);
    res.json(picture)
    });
};

exports.create = function (req, res, next) {
    var pic = new Picture();
    pic.name = req.body.name;
    pic.created_at = new Date();
    pic.data = null;
    
    pic.save(function (err) {
        if (err)
            res.send(err);
        res.json({message: 'Pic created..'});
    }); 
};

exports.setBinary = function (req, res, next) {
    var buf = req.rawBody;
    Picture.findById(req.params.picture_id, function (err, picture) {
        if (err)
            res.send(err);
        picture.data = buf;
        picture.save(function (err) {
            if (err)
                res.send(err);
            res.sendStatus(200);
        });
    });                    
};

exports.getBinary = function (req, res, next) {
    Picture.findById(req.params.picture_id, function (err, picture) {
        if (err)
            res.send(err);
        res.contentType("image/png");
        res.send(picture.data);
    });
};
