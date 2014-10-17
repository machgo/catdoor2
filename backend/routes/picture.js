var express = require('express');
var router = express.Router();

var Picture = require ('../app/models/picture');

router.use(function(req, res, next){
    console.log('Some access...');
    next();
});


//GET INDEX
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
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
    picture.name = req.body.name;
    picture.created = new Date().toJSON();
    console.log(req.body.data);
    var buf = new Buffer (req.body.name, 'base64');
    picture.data = buf;

    picture.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Picture created'});
    });
});



module.exports = router;
