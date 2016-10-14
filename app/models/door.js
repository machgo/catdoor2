var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoorSchema = new Schema({
    unlocked: Boolean
});

module.exports = mongoose.model('Door', DoorSchema);