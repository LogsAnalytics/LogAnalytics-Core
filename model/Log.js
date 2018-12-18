
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('log', new Schema({
    ESA_DIRIP : String,
    ESA_MODULO : String,
    ESA_FECINITRA : Date,
    ESA_TRATIM : Number,
    ESA_CAMPO5 : String,
    ESA_PARAMETROS : String,
    ESA_CAMPO2 : String,
    ESA_CAMPO3 : String,
    reg_time: {type: Date, default: Date.now }
},{
        versionKey: false,
        strict: false
    }
));

module.exports = mongoose.model('log');