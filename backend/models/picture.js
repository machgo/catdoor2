var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var pictureSchema = new Schema({
    name: String,
    creationDate: Date,
    data: Buffer
});

module.exports = mongoose.model('Picture', pictureSchema);
