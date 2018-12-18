
/**
 * Methods to work with Dates
 */

var moment = require("moment");
var moment = require('moment-timezone');

/**
 *
 * @param hora
 * @returns {*}
 */
/*function hourFormat(hora){
    if(hora < 0){
        hora = "23";
    }
    if(hora < 10){
        hora = "0" + hora;
    }
    return hora;
}*/

/**
 *
 * @param month
 * @returns {*}
 */
/*function monthFormat(month){
    month++;
    if(month < 10){
        month = "0" + month;
    }
    return month;
}*/

/**
 *
 * @param date
 * @returns {*}
 */
/*function dateFormat(date){
    if(date < 10){
        date = "0" + date;
    }
    return date;
}

function minutesFormat(minutes){
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    return minutes;
}

function secondsFormat(seconds){
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    return seconds;
}

function milisecondsFormat(miliseconds){
    if(miliseconds < 10){
        miliseconds = "0" + miliseconds;
    }
    return miliseconds;
}

function formatSystemHour(year, mes, dia, hora, minutos, segundos, milisegundos) {
    var fullSystemHour = year
    + "-" + mes
    + "-" + dia
    + "T" + hora
    + ":" + minutos
    + ":" + segundos
    + "." + milisegundos + "Z";

    return fullSystemHour;
}*/

/**
 * Returns last hour time frame.
 * @param inicio
 * @param fin
 */
exports.lastHourTimeFrame  = function (callback){
    var inicio = moment().utc().format();
    var fin = moment().add(1,"hours").utc().format();
    callback(inicio, fin);
};

/**
 * Returns the time frame between now and minutes ago
 * @param minutes
 * @param callback
 */
exports.minutesTimeFrame = function(minutes, callback){
    var hora = moment().add(1,"hours").utc();
    var fin = hora.format();
    var inicio = hora.subtract(minutes, 'minutes').utc().format();
    callback(inicio, fin);
};


/**
 * Transforms a date in GMT format to a date in UTC format
 * @param fecha
 * @param callback
 */
exports.convertGMTToUTC = function(fecha, callback){
    var gmt = new Date(moment(fecha).utc().format());
    callback(gmt);
}

/**
 * Transforms a date in GMT format to a date in UTC format
 * @param fecha
 */
function convertsUTCToGMT(fecha) {
    var gmt = new moment(fecha).format();
    return gmt;
}

/**
 *
 * @param fecha
 * @param callback
 */
exports.convertUTCToGMT = function (fecha, callback){
    var gmt = convertsUTCToGMT(fecha);
    callback(gmt);
}

exports.convertYear = function (fecha, callback){
    var gmt = new moment(fecha).format("YYYY-MM-DD");
    callback(gmt);
}

exports.convertObjectUTCToGMT = function(obj, callback){
    if (typeof obj.length === "undefined"){
        obj._doc.fecinitra = convertsUTCToGMT(obj._doc.fecinitra);
        obj._doc.fecfintra = convertsUTCToGMT(obj._doc.fecfintra);
    }
    else{
        for(i = 0; i < obj.length;i++) {
            obj[i]._doc.fecinitra = convertsUTCToGMT(obj[i]._doc.fecinitra);
            obj[i]._doc.fecfintra = convertsUTCToGMT(obj[i]._doc.fecfintra);
        }

    }

    callback(obj);
}