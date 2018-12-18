var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

module.exports = mongoose.model('estadistica', new Schema({
    hora: Number,
    total: SchemaTypes.Double,
    media: SchemaTypes.Double,
    primera_conexion: Date,
    ultima_conexion: Date,
    conexion_mas_larga: Number,
    conexion_mas_corta: Number,
    warnings: Number,
    reg_time: {type: Date, default: Date.now }
},
    {
        versionKey: false,
        strict: false
    }
));
module.exports = mongoose.model('estadistica');