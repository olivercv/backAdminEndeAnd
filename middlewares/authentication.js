var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ======================================
// Veriificar token
// ======================================

exports.checkToken = function(req, res, next) {


    var token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded ) => {
        if(err) { 
            return res.status(401).json({
                ok: false,
                mensaje: 'Token inválido',
                errors: err
            });
        };

        req.user = decoded.user;

        next();

        // return res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });

    });

}


