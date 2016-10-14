var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: String,
    sender: String,
    created_at: Date,
    data: Buffer
});

//remove binary data from model
EventSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.data;
    return obj;
}

module.exports = mongoose.model('Event', EventSchema);