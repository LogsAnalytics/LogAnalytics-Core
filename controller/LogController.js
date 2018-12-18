
var logRepository = require("./../repository/LogRepository.js");
var jwt            = require('jsonwebtoken');
var config         = require('../server.properties');
var isodate        = require("isodate");


/**
 * Obtiene todos los logs de una nomApl
 * @param req
 * @param res
 */
exports.getAllLogsByApp = function(req, res){

    logRepository.getAllLogsByApp(req.params.nomApl, function(err, obj){
        if(err != null){
            res.writeHead(400, {'content-type' : 'text/plain'});
            res.write("See ya in anotha' life brotha\n" + err);
            res.end();
        }else{
            res.send(obj);
        }
    })
};

/**
 * Devuelve todos los logs del modulo de una nomApl
 * @param req
 * @param res
 */
exports.getAllLogsByAppAndModulo = function(req, res){

    logRepository.getAllLogsByAppAndModulo(req.params.nomApl, req.params.modulo, function(err, obj){
        if(err != null){
            res.writeHead(400, {'content-type' : 'text/plain'});
            res.write("See ya in anotha' life brotha\n" + err);
            res.end();
        }else{
            res.send(obj);
        }
    })
};

/**
 * Obtiene los logs de una aplicación en un intervalo de tiempo
 * @param req
 * @param res
 */
exports.getAllLogsByAppAndDate = function(req, res){

    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getAllLogsByAppAndDate(req.params.nomApl, fechaInicio, fechaFin, function(err, obj){
        if(err != null){
            res.writeHead(400, {'content-type' : 'text/plain'});
            res.write("See ya in anotha' life brotha\n" + err);
            res.end();
        }else{
            res.send(obj);
        }
    })
};

/**
 * Obtiene los logs de un módulo de una aplicación en un intervalo de tiempo
 * @param req
 * @param res
 */
exports.getAllLogsByAppAndModuloAndDate = function(req, res){

    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getAllLogsByAppAndModuloAndDate(req.params.nomApl, req.params.modulo, fechaInicio, fechaFin, function(err, obj){
        if(err != null){
            res.writeHead(400, {'content-type' : 'text/plain'});
            res.write("See ya in anotha' life brotha\n" + err);
            res.end();
        }else{
            res.send(obj);
        }
    })
};

/**
 * Añade un log
 * @param req
 * @param res
 */
exports.addLog = function (req, res) {

    var fields = req.body;
            logRepository.create(fields, function (err, log) {
                if (err != null) {
                    res.writeHead(400, {'content-type': 'text/plain'});
                    res.write(err);
                    res.end();
                } else {
                    res.writeHead(200, {'content-type': 'text/plain'});
                    res.write('Log Created : ');
                    res.end();
                }
            });

};

/**
 * Obtiene la estadísticas a nivel general
 * @param req
 * @param res
 */
exports.getStatistics = function (req, res) {

    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getStatistics(fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 * Muestra las estadísticas de todas las nomAples, agrupadas por aplicación.
 * @param req
 * @param res
 */
exports.getStatisticsGroupByApp = function (req, res) {

    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getStatisticsGroupByApp(fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};


/**
 * Muestra las estadísticas de una determinada aplicación en un periodo concreto.
 * @param req
 * @param res
 */
exports.getStatisticsByApp = function (req, res) {

    var nomApl = req.params.nomApl;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getStatisticsByApp(nomApl, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 * Muestra las estadísticas de un determinado módulo de una aplicación en un periodo concreto.
 * @param req
 * @param res
 */
exports.getStatisticsByAppModulo = function (req, res) {

    var nomApl = req.params.nomApl;
    var modulo = req.params.modulo;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getStatisticsByAppModulo(nomApl, modulo, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};


/**
 * Obtiene los warnings de una aplicación.
 * @param req
 * @param res
 */
exports.getWarningsByApp = function (req, res) {

    var nomApl = req.params.nomApl;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getWarningsByApp(nomApl, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 * Obtiene los warnings del módulo de de una aplicación
 * @param req
 * @param res
 */
exports.getWarningsByAppAndModulo = function (req, res) {

    var nomApl = req.params.nomApl;
    var modulo = req.params.modulo;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getWarningsByAppAndModulo(nomApl, modulo, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 * Obtiene las diferentes nomAples
 * @param req
 * @param res
 */
exports.getAllApps = function (req, res) {
    logRepository.getAllApps(function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 * Devuelve todos los módulos de una nomApl
 * @param req
 * @param res
 */
exports.getAllModulosByApp = function (req, res) {
    var nomApl = req.params.nomApl;
    logRepository.getAllModulosByApp(nomApl, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 * Obtiene las estadísticas de una aplicación agrupadas por módulo y hora
 * @param req
 * @param res
 */
exports.getModuloAppStatisticsGroupByDayAndHour = function (req, res) {
    var nomApl = req.params.nomApl;
    var modulo = req.params.modulo;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getModuloAppStatisticsGroupByDayAndHour(nomApl, modulo, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.getModuloAppStatisticsGroupByDayAndHourAndMinute = function (req, res) {
    var nomApl = req.params.nomApl;
    var modulo = req.params.modulo;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getModuloAppStatisticsGroupByDayAndHourAndMinute(nomApl, modulo, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.getModuloAppStatisticsGroupByDayAndHourAndMinuteAndSecond = function (req, res) {
    var nomApl = req.params.nomApl;
    var modulo = req.params.modulo;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getModuloAppStatisticsGroupByDayAndHourAndMinuteAndSecond(nomApl, modulo, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.getAppStatisticsGroupByDayAndHour = function (req, res) {
    var nomApl = req.params.nomApl;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getAppStatisticsGroupByDayAndHour(nomApl, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.getAppStatisticsGroupByDayAndHourAndMinute = function (req, res) {
    var nomApl = req.params.nomApl;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getAppStatisticsGroupByDayAndHourAndMinute(nomApl, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.getAppStatisticsGroupByDayAndHourAndMinuteAndSecond = function (req, res) {
    var nomApl = req.params.nomApl;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getAppStatisticsGroupByDayAndHourAndMinuteAndSecond(nomApl, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.getLogByUuid = function (req, res) {

    var uuid = req.params.uuid;

    logRepository.getLogByUuid(uuid, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.getLogBySessionOrUuid = function (req, res) {

    var uuid = req.params.uuid;
    var session = req.params.session;

    logRepository.getLogBySessionOrUuid(session, uuid, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
};

exports.getAvailability = function (req, res) {
    var nomApl = req.params.nomApl;
    var modulo = req.params.modulo;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getAvailability(nomApl, modulo, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
}

/*exports.getFlightAvailability = function (req, res) {
    var nomApl = req.params.nomApl;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getFlightAvailability(nomApl, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
}

exports.getHotelAvailability = function (req, res) {
    var nomApl = req.params.nomApl;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getHotelAvailability(nomApl, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
}*/

exports.getAVGTimeResponseAvailability = function (req, res) {
    var nomApl = req.params.nomApl;
    var modulo = req.params.modulo;
    var fechaInicio = req.params.fechaInicio;
    var fechaFin = req.params.fechaFin;

    logRepository.getAVGTimeResponseAvailability(nomApl, modulo, fechaInicio, fechaFin, function (err, obj) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Error: " + err);
            res.end();
        } else {
            res.send(obj);
        }
    });
}









