var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    name: String,
    created_at: Date,
    data: Buffer
});

//remove binary data from model
PictureSchema.methods.toJSON  = function(){
    var obj = this.toObject();
    delete obj.data;
    return obj;
}

module.exports = mongoose.model('Picture', PictureSchema);