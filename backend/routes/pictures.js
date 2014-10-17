var Picture = require('../models/picture');
var express = require('express');
var router = express.Router();

router.route('/pictures').get(function(req,res) {
    Picture.find(function(err,pictures) {
        if (err) {
            return res.send(err);
        }

        res.json(pictures);
    ));
)};
