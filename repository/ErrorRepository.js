
var mongoose        = require("mongoose");
var Log            = mongoose.model('log');

exports.findErrors = function(nomApl, fechaInicio, fechaFin, callback){

    var fInicio = new Date(fechaInicio);
    var fFin = new Date(fechaFin);

    Log.find({ "warning":"SEVERE", "nomApl": nomApl, fecinitra: {"$gte" : fInicio, "$lte" : fFin }} , function(err, obj){
        if(err != null){
            callback(err, obj);
        }
        else{
            callback(null, obj);
        }
    })

};