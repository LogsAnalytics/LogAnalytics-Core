
var mongoose        = require("mongoose");
var Estadistica =   mongoose.model('estadistica');
var jwt             = require('jsonwebtoken');
var bcrypt          = require('bcryptjs');
var config          = require('../server.properties');

var estadisticaMapper = require('../Mapper/EstadisticaMapper');

/**
 * Obtiene las estadísticas en una hora determinada
 * @param hora
 * @param callback
 */
exports.getEstadisticaByHora = function (hora, callback){
    Estadistica.find({"hora":hora}, function(err, obj){
        if(err != null){
            callback(err, obj);
        }
        else{
            callback(null, obj);
        }
    });
};

/**
 * Guarda elementos en la colección estadistica
 * @param obj
 * @param callback
 */
exports.saveEstadistica = function (obj, callback){

    if (typeof obj.length === "undefined") {

        var newEstadistica;
        estadisticaMapper.ObjToEstadistica(obj[i], function (newEstadistica){
            newEstadistica.save(function (err) {
                if (err != null) {
                    callback(err, null);
                } else {
                    /!*callback(null, newLog);*!/
                }
            });
        });
    }
    else{
        for(i = 0; i < obj.length;i++) {
            var newEstadistica;
            estadisticaMapper.ObjToEstadistica(obj[i], function (newEstadistica){
                newEstadistica.save(function (err) {
                    if (err != null) {
                        callback(err, null);
                    } else {
                        /!*callback(null, newLog);*!/
                    }
                });
            });
        }
    }
    callback(null, newEstadistica);
};