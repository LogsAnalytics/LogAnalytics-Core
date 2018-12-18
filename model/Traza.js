
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('traza', new Schema({
        CAMPO1 : String,
        CAMPO2 : String,
        CAMPO3 : String,
        CAMPO4 : String,
        reg_time: {type: Date, default: Date.now }
    },{
        versionKey: false,
        strict: false
    }
));

module.exports = mongoose.model('log');