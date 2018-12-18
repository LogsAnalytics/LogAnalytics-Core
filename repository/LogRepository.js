
var mongoose        = require("mongoose");
var Log             = mongoose.model('log');
var Estadistica     = mongoose.model('estadistica');
var jwt             = require('jsonwebtoken');
var bcrypt          = require('bcryptjs');
var config          = require('../server.properties');
/*var moment = require("moment");
var moment = require('moment-timezone');*/
var timeFrame = require('../utils/TimeFrame.js');

/**
 *
 * @param callback
 */
exports.getAllLogsByApp = function (nomApl, callback){
    Log.find({"nomApl" : nomApl}, function(err, obj){
        if(err != null){
            callback(err, obj);
        }
        else{
            callback(null, obj);
        }
    })
};

/**
 * Devuelve todos los logs del módulo de una aplicación.
 * @param nomApl
 * @param modulo
 * @param callback
 */
exports.getAllLogsByAppAndModulo = function(nomApl, modulo, callback){
    Log.find({
            "nomApl" : nomApl,
            "modulo" : modulo},
        function(err, obj){
            if(err != null){
                callback(err, obj);
            }
            else{
                callback(null, obj);
            }
        }
    )
};

/**
 * Obtiene los logs de una aplicación en un intervalo de tiempo
 * @param nomApl
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getAllLogsByAppAndDate = function(nomApl, fechaInicio, fechaFin, callback){
    var fInicio;
    var fFin;

    timeFrame.convertGMTToUTC(fechaInicio, function(fecha){
        fInicio = fecha;
    });

    timeFrame.convertGMTToUTC(fechaFin, function(fecha){
        fFin = fecha;
    });

    Log.find(
        {$and: [
            {"nomApl" : nomApl},
            { fecinitra: { $gte: fInicio } }, { fecinitra: { $lte: fFin } }
        ]},
        function(err, obj){
        if(err != null){
            callback(err, obj);
        }
        else{
            timeFrame.convertObjectUTCToGMT(obj, function(obj){
                callback(null, obj);
            });
        }

    })
};


/**
 * Obtiene los logs de un módulo de una aplicación en un intervalo de tiempo
 * @param nomApl
 * @param modulo
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getAllLogsByAppAndModuloAndDate = function(nomApl, modulo, fechaInicio, fechaFin, callback){
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.find(
        {$and: [
            {"nomApl" : nomApl},
            { fecinitra: { $gte: fInicio } }, { fecinitra: { $lte: fFin } },
            {"modulo" : modulo}
        ] },
        function(err, obj){
            if(err != null){
                callback(err, obj);
            }
            else{
                callback(null, obj);
            }
        })
};

/**
 *
 * @param obj
 * @param callback
 */
exports.create = function (obj, callback) {
    var newLog;

    if (typeof obj.length === "undefined") {

        timeFrame.convertGMTToUTC(obj.fecinitra, function(fecha){
            obj.fecinitra = fecha;
        });

        timeFrame.convertGMTToUTC(obj.fecfintra, function(fecha){
            obj.fecfintra = fecha;
        });

        newLog = new Log(obj);
        newLog.save(function (err) {
            if (err != null) {
                //callback(err, null);
            } else {
                /!*callback(null, newLog);*!/
            }
        });
    }
    else{
        for(i = 0; i < obj.length;i++) {
            timeFrame.convertGMTToUTC(obj.fecinitra, function(fecha){
                obj[i].fecinitra = fecha;
            });

            timeFrame.convertGMTToUTC(obj.fecfintra, function(fecha){
                obj[i].fecfintra = fecha;
            });

            newLog = new Log(obj[i]);
            newLog.save(function (err) {
                if (err != null) {
                    callback(err, null);
                } else {
                    /!*callback(null, newLog);*!/
                }
            });
        }
    }
    callback(null, newLog);
};



/**
 * Obtiene las estadísticas
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getStatistics = function (fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate(

        {

            $match : { fecinitra: {"$gt" : fInicio, "$lt" : fFin }}},
    { $group:
    {
        _id : "estadistica",
        total : { $sum : 1 },
        media : { $avg : "$tiempo" },
        conexion_mas_larga : {$max : "$tiempo" },
        conexion_mas_corta : {$min : "$tiempo" },
        warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
    }
    },function(err, obj){
        if(err != null){
            callback(err, null);
        }else{
            callback(null, obj);
        }
    });

};

/**
 * Muestra las estadísticas de todas las aplicaciones, agrupadas por aplicación, en un periodo determinado.
 * @param fechaInicio : Fecha Inicial del periodo a consultar.
 * @param fechaFin : Fecha Final del periodo a consultar.
 * @param callback : Devuelve un objeto json con la información obtenida. En caso de error devuelve el error
 */
exports.getStatisticsGroupByApp = function (fechaInicio, fechaFin, callback){
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate(

        { $match : { fecinitra: {"$gt" : fInicio, "$lt" : fFin }}},
        { $unwind : "$nomApl"
        },
        { $group:
        {
            _id : { aplicacion : "$nomApl"},
            total : { $sum : 1 },
            media : { $avg : "$tiempo" },
            conexion_mas_larga : {$max : "$tiempo" },
            conexion_mas_corta : {$min : "$tiempo" },
            warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
        }

        },function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

/**
 * Muestra las estadísticas de una aplicación, en un periodo determinado.
 * @param fechaInicio : Fecha Inicial del periodo a consultar.
 * @param fechaFin : Fecha Final del periodo a consultar.
 * @param callback : Devuelve un objeto json con la información obtenida. En caso de error devuelve el error
 */
exports.getStatisticsByApp = function (aplicacion, fechaInicio, fechaFin, callback){
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate(

        { $match : {nomApl : {"$eq" : aplicacion}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
        { $unwind : "$nomApl"
        },
        { $group:
        {
            _id : { aplicacion : "$nomApl"},
            total : { $sum : 1 },
            media : { $avg : "$tiempo" },
            conexion_mas_larga : {$max : "$tiempo" },
            conexion_mas_corta : {$min : "$tiempo" },
            warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
        }

        },function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

/**
 * Mustra las estadísticas de un módulo de una aplicacion en concreto en un periodo de tiempo
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getStatisticsByAppModulo = function (aplicacion, modulo, fechaInicio, fechaFin, callback){
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate(

        { $match : {nomApl : {"$eq" : aplicacion}, fecinitra: {"$gt" : fInicio, "$lt" : fFin }}},
        { $match : { modulo : {"$eq" : modulo}}},
        { $unwind : "$nomApl"
        },
        { $group:
        {
            _id : { modulo : "$modulo"},
            total : { $sum : 1 },
            media : { $avg : "$tiempo" },
            conexion_mas_larga : {$max : "$tiempo" },
            conexion_mas_corta : {$min : "$tiempo" },
            warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
        }

        },function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

/**
 * Obtiene los logs con warnings de una aplicación en una periodo determinado.
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getWarningsByApp = function (aplicacion, fechaInicio, fechaFin, callback){
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

        Log.find({
            warning : {"$gt" : " "},
            nomApl : aplicacion,
            fecinitra: {"$gt" : fInicio, "$lt" : fFin}
        },function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });
};

/**
 * Obtiene los logs con warnings de un modulo de una aplicación en una periodo determinado.
 * @param aplicacion
 * @param modulo
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getWarningsByAppAndModulo = function (aplicacion, modulo, fechaInicio, fechaFin, callback){
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.find({
        warning : {"$gt" : " "},
        nomApl : aplicacion,
        modulo : modulo,
        fecinitra: {"$gte" : fInicio, "$lte" : fFin}
    },function(err, obj){
        if(err != null){
            callback(err, null);
        }else{
            callback(null, obj);
        }
    });
};

/**
 * Obtiene las distintas aplicaciones.
 * @param callback
 */
exports.getAllApps = function (callback){

    Log.distinct(("nomApl"),
        function(err, obj){
        if(err != null){
            callback(err, null);
        }else{
            callback(null, obj);
        }
    });
};


/**
 * Obtiene los módulos de una aplicación.
 * @param aplicacion
 * @param callback
 */
exports.getAllModulosByApp = function (aplicacion, callback){

    Log.distinct("modulo", {"nomApl":aplicacion} ,
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });
};

/**
 * Obtiene las estadísticas de un módulo de una aplicación agrupadas por hora
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getModuloAppStatisticsGroupByDayAndHour = function (aplicacion, modulo, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
        { $match : {nomApl : {"$eq" : aplicacion}, modulo : {"$eq" : modulo}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
        { $unwind : "$modulo"
        },
        {
            $project:{
                agrupar: {
                    modulo: "$modulo",
                    DIA: {"$dayOfMonth" : "$fecinitra"},
                    HORA: { $hour: "$fecinitra" }
                },
                modulo : 1,
                fecinitra : "$fecinitra",
                tiempo : "$tiempo",
                warning : "$warning"
            }
        },
        { $group:
        {
            _id : "$agrupar",
            modulo: { $max: "$agrupar.modulo" } ,
            dia: { $max: "$agrupar.DIA" } ,
            hora: { $max: "$agrupar.HORA" } ,
            total : { $sum : 1 },
            media : { $avg : "$tiempo" },
            primera_conexion : {$min : "$fecinitra"},
            ultima_conexion : {$max : "$fecinitra"},
            conexion_mas_larga : {$max : "$tiempo" },
            conexion_mas_corta : {$min : "$tiempo" },
            warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
        }},
            {$sort:{dia: 1, hora:1}}
        ],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

exports.getModuloAppStatisticsGroupByDayAndHourAndMinute = function (aplicacion, modulo, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion}, modulo : {"$eq" : modulo}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
            { $unwind : "$modulo"
            },
            {
                $project:{
                    agrupar: {
                        modulo: "$modulo",
                        DIA: {"$dayOfMonth" : "$fecinitra"},
                        HORA: { $hour: "$fecinitra" },
                        MINUTO: { $minute: "$fecinitra" }
                    },
                    modulo : 1,
                    fecinitra : "$fecinitra",
                    tiempo : "$tiempo",
                    warning : "$warning"
                }
            },
            { $group:
            {
                _id : "$agrupar",
                modulo: { $max: "$agrupar.modulo" } ,
                dia: { $max: "$agrupar.DIA" } ,
                hora: { $max: "$agrupar.HORA" } ,
                minuto: { $max: "$agrupar.MINUTO" } ,
                total : { $sum : 1 },
                media : { $avg : "$tiempo" },
                primera_conexion : {$min : "$fecinitra"},
                ultima_conexion : {$max : "$fecinitra"},
                conexion_mas_larga : {$max : "$tiempo" },
                conexion_mas_corta : {$min : "$tiempo" },
                warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
            }},
            {$sort:{dia: 1, hora:1, minuto: 1}}
        ],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

exports.getModuloAppStatisticsGroupByDayAndHourAndMinuteAndSecond = function (aplicacion, modulo, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion}, modulo : {"$eq" : modulo}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
            { $unwind : "$modulo"
            },
            {
                $project:{
                    agrupar: {
                        modulo: "$modulo",
                        DIA: {"$dayOfMonth" : "$fecinitra"},
                        HORA: { $hour: "$fecinitra" },
                        MINUTO: { $minute: "$fecinitra" },
                        SEGUNDO: { $second: "$fecinitra" }
                    },
                    modulo : 1,
                    fecinitra : "$fecinitra",
                    tiempo : "$tiempo",
                    warning : "$warning"
                }
            },
            { $group:
            {
                _id : "$agrupar",
                modulo: { $max: "$agrupar.modulo" } ,
                dia: { $max: "$agrupar.DIA" } ,
                hora: { $max: "$agrupar.HORA" } ,
                minuto: { $max: "$agrupar.MINUTO" } ,
                segundo: { $max: "$agrupar.SEGUNDO" } ,
                total : { $sum : 1 },
                media : { $avg : "$tiempo" },
                primera_conexion : {$min : "$fecinitra"},
                ultima_conexion : {$max : "$fecinitra"},
                conexion_mas_larga : {$max : "$tiempo" },
                conexion_mas_corta : {$min : "$tiempo" },
                warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
            }},
            {$sort:{dia: 1, hora:1, minuto: 1, segundo: 1}}
        ],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

/**
 * Obtiene las estadísticas de una aplicación agrupadas por dia y hora
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getAppStatisticsGroupByDayAndHour = function (aplicacion, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
            { $unwind : "$modulo"
            },
            {
                $project:{
                    agrupar: {
                        DIA: {"$dayOfMonth" : "$fecinitra"},
                        HORA: { $hour: "$fecinitra" }
                    },
                    modulo : 1,
                    tiempo : "$tiempo",
                    fecinitra : "$fecinitra",
                    warning : "$warning"
                }
            },
            { $group:
            {
                _id : "$agrupar",
                hora: { $max: "$agrupar.HORA" } ,
                dia: { $max: "$agrupar.DIA" } ,
                total : { $sum : 1 },
                media : { $avg : "$tiempo" },
                primera_conexion : {$min : "$fecinitra"},
                ultima_conexion : {$max : "$fecinitra"},
                conexion_mas_larga : {$max : "$tiempo" },
                conexion_mas_corta : {$min : "$tiempo" },
                warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
            }},
            {$sort:{dia: 1, hora:1}}
        ],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

/**
 *
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getAppStatisticsGroupByDayAndHourAndMinute = function (aplicacion, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
            { $unwind : "$modulo"
            },
            {
                $project:{
                    agrupar: {
                        DIA: {"$dayOfMonth" : "$fecinitra"},
                        HORA: { $hour: "$fecinitra" },
                        MINUTO: { $minute: "$fecinitra" }
                    },
                    modulo : 1,
                    tiempo : "$tiempo",
                    fecinitra : "$fecinitra",
                    warning : "$warning",
                }
            },
            { $group:
            {
                _id : "$agrupar",
                hora: { $max: "$agrupar.HORA" } ,
                dia: { $max: "$agrupar.DIA" } ,
                minuto: { $max: "$agrupar.MINUTO" } ,
                total : { $sum : 1 },
                media : { $avg : "$tiempo" },
                primera_conexion : {$min : "$fecinitra"},
                ultima_conexion : {$max : "$fecinitra"},
                conexion_mas_larga : {$max : "$tiempo" },
                conexion_mas_corta : {$min : "$tiempo" },
                warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
            }},
            {$sort:{dia: 1, hora:1, minuto : 1}}
        ],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

/**
 *
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getAppStatisticsGroupByDayAndHourAndMinuteAndSecond = function (aplicacion, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
            { $unwind : "$modulo"
            },
            {
                $project:{
                    agrupar: {
                        DIA: {"$dayOfMonth" : "$fecinitra"},
                        HORA: { $hour: "$fecinitra" },
                        MINUTO: { $minute: "$fecinitra" },
                        SEGUNDO: { $second: "$fecinitra" }
                    },
                    modulo : 1,
                    tiempo : "$tiempo",
                    fecinitra : "$fecinitra",
                    warning : "$warning"
                }
            },
            { $group:
            {
                _id : "$agrupar",
                hora: { $max: "$agrupar.HORA" } ,
                dia: { $max: "$agrupar.DIA" } ,
                minuto: { $max: "$agrupar.MINUTO" } ,
                segundo: { $max: "$agrupar.SEGUNDO" } ,
                total : { $sum : 1 },
                media : { $avg : "$tiempo" },
                primera_conexion : {$min : "$fecinitra"},
                ultima_conexion : {$max : "$fecinitra"},
                conexion_mas_larga : {$max : "$tiempo" },
                conexion_mas_corta : {$min : "$tiempo" },
                warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
            }},
            {$sort:{dia: 1, hora:1, minuto : 1, segundo: 1}}
        ],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });
};
/**
 * Obtiene los logs en los el uuid coincidan con el uuid dado
 * @param uuid
 * @param callback
 */
exports.getLogByUuid = function (uuid, callback){
    Log.find({"uuid" : uuid}, function(err, obj){
        if(err != null){
            callback(err, obj);
        }
        else{
            callback(null, obj);
        }
    }).sort({fecinitra: 1})
};

/**
 * Obtiene los logs en los que la session del request o el uuid coincidan con la session o uuid dados
 * @param session
 * @param uuid
 * @param callback
 */
exports.getLogBySessionOrUuid = function (session, uuid, callback){
    Log.find({$or:[{"request.session":session}, {"uuid":uuid}]}, function(err, obj){
        if(err != null){
            callback(err, obj);
        }
        else{
            callback(null, obj);
        }
    }).sort({fecinitra: 1})
};

/**
 * Obtiene las estadísticas de una aplicación agrupadas por hora
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getAppStatisticsGroupByHour = function (aplicacion, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion}, fecinitra: {"$gte" : fInicio, "$lte" : fFin }}},
            { $unwind : "$modulo"
            },
            {
                $project:{
                    agrupar: {
                        HORA: { $hour: "$fecinitra" }
                    },
                    modulo : 1,
                    tiempo : "$tiempo",
                    fecinitra : "$fecinitra",
                    warning : "$warning"
                }
            },
            { $group:
                {
                    _id : "$agrupar",
                    hora: { $max: "$agrupar.HORA" } ,
                    total : { $sum : 1 },
                    media : { $avg : "$tiempo" },
                    primera_conexion : {$min : "$fecinitra"},
                    ultima_conexion : {$max : "$fecinitra"},
                    conexion_mas_larga : {$max : "$tiempo" },
                    conexion_mas_corta : {$min : "$tiempo" },
                    warnings: {$sum: { $cond: [ { $gt: [ "$warning", " "] } , 1, 0 ] }}
                }},
            {$sort:{hora:1}}
        ],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

/**
 * Devuelve el número de llamadas a disponibilidad aérea de una aplicación
 * @param aplicacion
 * @param fechaInicio
 * @param fechaFin
 * @param callback
 */
exports.getAvailability = function (aplicacion, modulo, fechaInicio, fechaFin, callback){
    var aplicacion = aplicacion;
    var modulo = modulo;
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion},
                modulo : {"$eq" : modulo},
                fecinitra: {"$gte" : fInicio,
                    "$lte" : fFin }}},
            { $unwind : "$modulo"},
            {
                $project:{
                    agrupar: {
                        modulo: "$modulo"
                    },
                    modulo : 1
                }
            },
            { $group:
                {
                    _id : "$modulo",
                    total : { $sum : 1 }
                }}],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};

exports.getAVGTimeResponseAvailability = function (aplicacion, modulo, fechaInicio, fechaFin, callback){
    var aplicacion = aplicacion;
    var modulo = modulo;
    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.aggregate([
            { $match : {nomApl : {"$eq" : aplicacion},
                modulo : {"$eq" : modulo},
                fecinitra: {"$gte" : fInicio,
                    "$lte" : fFin }}},
            { $unwind : "$modulo"},
            {
                $project:{
                    agrupar: {
                        modulo: "$modulo"
                    },
                    modulo : 1,
                    tiempo : "$tiempo"
                }
            },
            { $group:
                {
                    _id : "$modulo",
                    media : { $avg : "$tiempo" }
                }}],
        function(err, obj){
            if(err != null){
                callback(err, null);
            }else{
                callback(null, obj);
            }
        });

};


