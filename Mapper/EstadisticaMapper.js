
var mongoose        = require("mongoose");
var Estadistica =   mongoose.model('estadistica');
var jwt             = require('jsonwebtoken');

exports.ObjToEstadistica = function (obj, callback){
    var newEstadistica;
    newEstadistica = new Estadistica();
    newEstadistica.hora = obj.hora;
    newEstadistica.media = obj.media;
    newEstadistica.total = obj.total;
    newEstadistica.primera_conexion = obj.primera_conexion;
    newEstadistica.ultima_conexion = obj.ultima_conexion;
    newEstadistica.conexion_mas_larga = obj.conexion_mas_larga;
    newEstadistica.conexion_mas_corta = obj.conexion_mas_corta;
    newEstadistica.warnings = obj.warnings;
    callback(newEstadistica);
};
