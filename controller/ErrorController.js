

var errorRepository = require("./../repository/ErrorRepository.js");
var logRepository = require("./../repository/LogRepository.js");
var message = require("./../utils/Messages.js");
var timeFrame = require("./../utils/TimeFrame.js");
var isodate        = require("isodate");

/**
 * Checks errors that occurred during the last hour
 * @param callback
 */
exports.checkError = function (callback){
    var nomApl = "ULYSEO";
    var fInicio = "";
    var fFin = "";

    timeFrame.lastHourTimeFrame(function(inicio, fin){
        fInicio = inicio;
        fFin = fin;
    });

    console.log("Ejecución: " + fInicio);

    errorRepository.findErrors(nomApl, fInicio, fFin, function(error, obj){
       if(!error) {
           if (typeof  obj[0] !== "undefined") {
               modulo = obj[0]._doc.modulo;
               logRepository.getLogByUuid(obj[0]._doc.uuid, function (err, log) {
                   if (!err) {
                       message.buildErrorRequestMessage(log, function (error, msg) {
                           if (error == null) {
                               callback(null, msg);
                           }
                           else {
                               callback(error, null);
                           }
                       });
                   }
                   else {
                       res.writeHead(400, {'content-type': 'text/plain'});
                       res.write("Error: " + err);
                       res.end();
                   }
               });
           }
           else {

           }
       }
    });
};