
/**
 *
 * @param puntual
 * @param general
 * @param callback
 */
exports.buildStatisticsMessage = function(puntual, general, callback){
    var hora = puntual[0].hora;
    var i = 0;
    var mensaje = "WARNING. A las " + hora +  " horas los parámetros: \n";

    if (general[0]._doc.media.value < puntual[0].media){
        mensaje = mensaje + "- La media de tiempos de conexión.\n";
        i++;
    }

    if(general[0]._doc.warnings < puntual[0].warnings){
        mensaje = mensaje + "- El número de warnings.\n";
    }

    if(general[0]._doc.conexion_mas_larga < puntual[0].conexion_mas_larga){
        mensaje = mensaje + "- La conexión más larga.\n";
    }

    if(general[0]._doc.total.value < puntual[0].total){
        mensaje = mensaje + "- El número total de conexiones.\n";
    }

   mensaje = mensaje + "Exceden de la media de esos parámetros en la hora.";
    callback(null, mensaje);
};


exports.buildErrorRequestMessage = function(log, callback){
    var mensaje = "ERROR: El módulo ";
    if (typeof log.length !== "undefined") {
        mensaje = mensaje + log[0]._doc.modulo + " ha iniciado una request a las " + log[0]._doc.fecinitra + " .\n";

        for (i = 1; i < log.length; i++){
            if (log[i]._doc.warning == "SEVERE"){
                mensaje = mensaje + "--Fallo del módulo " + log[i]._doc.modulo + " a las " + log[i]._doc.fecinitra + " .\n";
            }
        }

        mensaje = mensaje + "**Información de la petición: \n";
        mensaje = mensaje + "    ***** APLICACION: " + log[0]._doc.nomApl + " .\n";
        mensaje = mensaje + "    ***** IP: " + log[0]._doc.ip + " .\n";
        mensaje = mensaje + "    ***** HOST: " + log[0]._doc.host + " .\n";
        mensaje = mensaje + "    ***** TIEMPO: " + log[0]._doc.tiempo + " .\n";
    }
    callback(null, mensaje);
};
