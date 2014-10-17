var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    filename: String,
    created: Date,
    data: Buffer
});

module.exports = mongoose.model('Picture', PictureSchema);
