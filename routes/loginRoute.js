var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var User = require('../models/user');


app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email}, (err, userStored) => {


        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        };

        if( !userStored ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if( !bcrypt.compareSync(body.password, userStored.password) ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });

        }

        // Crear un token
        userStored.password = ';)';
        var token = jwt.sign({ user: userStored}, SEED, { expiresIn: 144000 }); // 4 horas

        res.status(200).json({
            ok: false,
            user: userStored,
            token: token,
            id: userStored._id
        });


    

    })

    

});




module.exports = app;

