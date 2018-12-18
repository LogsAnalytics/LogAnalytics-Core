/**
 * Created by xx531 on 30/11/2016.
 */

var cron = require('node-cron');

var estadisticaController = require('../controller/EstadisticaController');
var errorController = require('../controller/ErrorController');
var slackController = require('../manager/SlackManager.js');
var timeFrame = require('../utils/TimeFrame.js');

module.exports = {
    schedule:function(){
        cron.schedule('* * * * *', function () {
            /*estadisticaController.saveEstadisticaLastHour(function (error, callback){
                if(!error){
                    console.log('running a task every minute2');
                }
            });

            estadisticaController.alerta(function (error, obj) {
                if(!error){
                    console.log(obj);
                    slackController.slackSend(obj);
                }
            });*/

            errorController.checkError(function (error, obj) {
                if(!error){
                    console.log(obj);
                    slackController.slackSend(obj);
                }
            });
        });
    }

};