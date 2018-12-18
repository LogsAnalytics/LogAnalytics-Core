
/** Required dependencies */
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    auth = require("http-auth"),

    /** Managers */
    DatabaseManager = require('./manager/DatabaseManager.js'),
    SchedulerManager = require('./manager/SchedulerManager.js'),

    config = require('./server.properties');

    var logController = require('./controller/LogController');
    var trazaController = require('./controller/TrazaController');

    /*var estadisticaController = require('./controller/EstadisticaController');*/

/** Create the database connection */
DatabaseManager.connectDB();
SchedulerManager.schedule();


/** Express Controller */d3fe58021
var controller = express.Router();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/** Middlewares */
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000
}));
app.use(bodyParser.json({limit: '5.0mb'}));
app.use(methodOverride());

/** Controller */
app.use(controller);
/** Add /api after port and before the methods of route */
app.use('/api', controller);


/*****************************************************
 //                 API ROUTES
 *****************************************************/

controller.route('/getAllLogsByApp/:nomApl').get(logController.getAllLogsByApp);

controller.route('/getAllLogsByAppAndModulo/:nomApl/:modulo').get(logController.getAllLogsByAppAndModulo);

controller.route('/addLog').post(logController.addLog);

controller.route('/getAllApps').get(logController.getAllApps);

controller.route('/getAllModulosByApp/:nomApl').get(logController.getAllModulosByApp);

controller.route('/getAllLogsByAppAndDate/:nomApl/:fechaInicio/:fechaFin').get(logController.getAllLogsByAppAndDate);

controller.route('/getAllLogsByAppAndModuloAndDate/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getAllLogsByAppAndModuloAndDate);

controller.route('/getAppStatisticsGroupByModuloDayAndHour/:nomApl/:fechaInicio/:fechaFin').get(logController.getAppStatisticsGroupByDayAndHour);

controller.route('/getAppStatisticsGroupByModuloDayAndHourAndMinute/:nomApl/:fechaInicio/:fechaFin').get(logController.getAppStatisticsGroupByDayAndHourAndMinute);

controller.route('/getAppStatisticsGroupByModuloDayAndHourAndMinuteAndSecond/:nomApl/:fechaInicio/:fechaFin').get(logController.getAppStatisticsGroupByDayAndHourAndMinuteAndSecond);

controller.route('/getModuloAppStatisticsGroupByDayAndHour/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getModuloAppStatisticsGroupByDayAndHour);

controller.route('/getModuloAppStatisticsGroupByDayAndHourAndMinute/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getModuloAppStatisticsGroupByDayAndHourAndMinute);

controller.route('/getModuloAppStatisticsGroupByDayAndHourAndMinuteAndSecond/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getModuloAppStatisticsGroupByDayAndHourAndMinuteAndSecond);

controller.route('/getLogByUuid/:uuid').get(logController.getLogByUuid);

controller.route('/getLogBySessionOrUuid/:session/:uuid').get(logController.getLogBySessionOrUuid);

controller.route('/getStatistics/:fechaInicio/:fechaFin').get(logController.getStatistics);

controller.route('/getStatisticsGroupByApp/:fechaInicio/:fechaFin').get(logController.getStatisticsGroupByApp);

controller.route('/getStatisticsByApp/:nomApl/:fechaInicio/:fechaFin').get(logController.getStatisticsByApp);

controller.route('/getWarningsByApp/:nomApl/:fechaInicio/:fechaFin').get(logController.getWarningsByApp);

controller.route('/getWarningsByAppAndModulo/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getWarningsByApp);

controller.route('/getStatisticsByAppModulo/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getStatisticsByAppModulo);

//---------------------************************** SERVICIOS CUM **************************---------------------//
controller.route('/getAvailability/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getAvailability);
//controller.route('/getHotelAvailability/:nomApl/:fechaInicio/:fechaFin').get(logController.getHotelAvailability);
controller.route('/getAVGTimeResponseAvailability/:nomApl/:modulo/:fechaInicio/:fechaFin').get(logController.getAVGTimeResponseAvailability);
//controller.route('/getAVGTimeResponseHotelAvailability/:nomApl/:fechaInicio/:fechaFin').get(logController.getAVGTimeResponseHotelAvailability);

//---------------------************************** SERVICIOS TRAZA **************************---------------------//
controller.route('/traza/:coleccion').post(trazaController.addTraza);

/** Start server */
app.listen(config.port, function () {
    console.log("*** Server Running on " + config.port);
});
