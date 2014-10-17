var express = require('express');
var router = express.Router();

var Picture = require ('../models/picture');

router.use(function(req, res, next){
    console.log('Some access...');
    next();
});


//GET INDEX
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});



//GET PICTURE RAW
router.route('/pictures/:picture_id').get(function(req, res){
    Picture.findById(req.params.picture_id, function(err, picture){
        if (err)
            res.send(err);
        res.json(picture);
    });
});

//GET PICTURES
router.route('/pictures').get(function(req, res){
    Picture.find(function(err, pictures) {
    	if (err)
			res.send(err);
		res.json(pictures);
    });
});


//POST PICTURE
router.route('/pictures').post(function(req, res) {
    var picture = new Picture();
    picture.filename = req.body.filename;
    picture.created = new Date().toJSON();
    var buf = new Buffer (req.body.data, 'base64');
    picture.data = buf;

    picture.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Picture created'});
    });
});



module.exports = router;
