var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoorSchema = new Schema({
    last_change: Date,
    unlocked: Boolean
});

module.exports = mongoose.model('Door', DoorSchema);