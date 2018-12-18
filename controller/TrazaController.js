
var trazaRepository = require("./../repository/TrazaRepository.js");
var jwt            = require('jsonwebtoken');

exports.addTraza = function (req, res) {

    var fields = req.body;
    trazaRepository.create(fields, req.params.coleccion, function (err, traza) {
        if (err != null) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write(err);
            res.end();
        } else {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('Traza Created : ');
            res.end();
        }
    });

};