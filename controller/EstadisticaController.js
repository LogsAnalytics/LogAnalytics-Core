
var estadisticaRepository = require("./../repository/EstadisticaRepository.js");
var logRepository = require("./../repository/LogRepository.js");
var jwt            = require('jsonwebtoken');
var config         = require('../server.properties');
var isodate        = require("isodate");
var message        = require("../utils/Messages.js");
var timeFrame = require("./../utils/TimeFrame.js");

/**
 * Guarda las estadísticas de un dia agrupadas por Hora
 * @param req
 * @param res
 */
exports.saveEstadisticaLastHour = function (callback) {

    var nomApl = "ULYSEO";
    var fInicio = "2016-12-01T17:57:00.000Z";
    var fFin = "2016-12-13T09:45:59.999Z";

    /*timeFrame.lastHourTimeFrame(function(inicio, fin){
        fInicio = inicio;
        fFin = fin;
    });*/



    logRepository.getAppStatisticsGroupByHour(nomApl, fInicio, fFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            estadisticaRepository.saveEstadistica(obj, function (err, estadistica) {
                if (err != null) {
                    res.writeHead(400, {'content-type': 'text/plain'});
                    res.write("Error: " + err);
                    res.end();
                } else {
                    callback(null, "ok");
                }
            });
        }
    });
};


exports.alerta = function (callback) {

    var nomApl = "ULYSEO";
    var fInicio = new Date("2016-12-13T10:00:00Z");
    var fFin = new Date("2016-12-13T10:59:59Z");
    var hora;

    /*var fInicio = "";
    var fFin = "";*/

    timeFrame.minutesTimeFrame(5, function(inicio, fin){
        fInicio = inicio;
        fFin = fin;
    });

    /*var fInicio = new Date("2016-12-13T10:00:00Z");
    var fFin = new Date("2016-12-13T10:59:59Z");*/

    logRepository.getAppStatisticsGroupByDayAndHour(nomApl, fInicio, fFin, function (err, puntual) {
        if (err != null) {
            //TODO: CAMBIAR ENVIO DE ERROR POR GUARDADO DE ERROR EN COLECCION NUEVA.
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            hora = 10;
            estadisticaRepository.getEstadisticaByHora(hora, function (err, general) {
                if (err != null) {
                    res.writeHead(400, {'content-type': 'text/plain'});
                    res.write("Error: " + err);
                    res.end();
                } else {
                    message.buildStatisticsMessage(puntual, general, function (error, msg){
                        if(error == null){
                            callback(null, msg);
                        }
                        else{
                            callback(error, null);
                        }
                        });
                }
            });
        }
    });

};

/**
 * Obtiene las estadísticas en una hora dada
 * @param req
 * @param res
 */
exports.getEstadisticaByHour = function (req, res) {

    var hora = req.params.hora;

    estadisticaRepository.getEstadisticaByHora(hora, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};
