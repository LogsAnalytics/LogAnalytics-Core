var timeFrame = require("./../utils/TimeFrame.js");

exports.create = function (obj, col, callback) {
    var Db = require('mongodb').Db,
        MongoClient = require('mongodb').MongoClient,
        Server = require('mongodb').Server,
        ReplSetServers = require('mongodb').ReplSetServers,
        ObjectID = require('mongodb').ObjectID,
        Binary = require('mongodb').Binary,
        GridStore = require('mongodb').GridStore,
        Grid = require('mongodb').Grid,
        Code = require('mongodb').Code,
        assert = require('assert');

    var db = new Db('logstvp', new Server('10.143.0.14', 27017));
    //var db = new Db('Globalia', new Server('localhost', 27017));
    db.open(function(err, db) {
        var day;
        var month;
        var year;
        var fecStr;

        var MongoClient = require('mongodb').MongoClient;

        MongoClient.connect('mongodb://logstvp:logstvp@10.143.0.14/logstvp', function(err, db) {
         if (err) {
         console.error(err);
         }
        var collection = db.collection(col);
        for(var i in obj){
            var obj2 = obj[i];
        for (var i2 in obj[i]) {
            if (obj2.hasOwnProperty(i2)) {
                //console.info(obj2[i]);
                if (typeof obj2[i2] == 'string') {
                    var day = parseInt(obj2[i2].substr(0, 2));
                    var month = parseInt(obj2[i2].substr(3, 2));
                    var year = parseInt(obj2[i2].substr(6, 4));
                    var hora;
                    if (day != NaN &&
                        (obj2[i2].substr(2, 1) == ("/") || obj2[i2].substr(2, 1) == ("-") ) &&
                        (month != NaN) &&
                        (obj2[i2].substr(5, 1) == '/' || obj2[i2].substr(5, 1) == '-') &&
                        (year != NaN)
                    ) {
                        if (obj2[i2].length > 10) {
                            hora = obj2[i2].substr(11, 8);
                            fecStr = year + "-" + month + "-" + day + " " + hora;
                        }
                        else {
                            fecStr = year + "-" + month + "-" + day + " 01:00:00";
                        }
                        var fec = new Date(fecStr);
                        timeFrame.convertGMTToUTC(fec, function (fecha) {
                            if (fecha != "Invalid Date") {
                                obj2[i2] = fecha;
                            }

                        });
                    }
                }
            }
        }
        collection.insert(obj2);
    }

            db.close();
            callback(null, db);
        });

    })

};