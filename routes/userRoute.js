var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAuthetication = require('../middlewares/authentication');

var app = express();

var User = require('../models/user');

// ======================================
// Obtener todos los usuarios
// ======================================


app.get('/', (req, res, next) => {
    
    var to = req.query.to || 0;
    to = Number(to);

    User.find({}, 'name email image role')
        .skip(to)
        .limit(5)
        .limit(5)
        .exec(
            (err, users) => {
            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }

            User.countDocuments({}, (err, counter) => {
                res.status(200).json({
                    ok: true,
                    users: users,
                    total: counter
                });

            });
    

        });

  
});




// ======================================
// actualizar usuario
// ======================================

app.put('/:id', mdAuthetication.checkToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById( id, (err, user) => {
        
        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        };

        if(!user){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'EL usuario con el id' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
        };

        
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, userStored) => {

            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            };


            res.status(200).json({
                ok: true,
                user: userStored
            });
        });
    });

});


// ======================================
// Crear un nuevo usuario
// ======================================

app.post('/', (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        imqge: body.imqge,
        role: body.role
    })

    user.save((err, userStored) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userStored,
            usertoken: req.user
        });



    });

})

// ======================================
// eliminar usuario usuario por ID
// ======================================

app.delete('/:id', mdAuthetication.checkToken, (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove( id, (err, userDeleted) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: err
            });
        };

        if(!userDeleted) { 
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario para ese id',
                errors: {message: 'No existe un usuario para ese id'}
            });
        }

        res.status(201).json({
            ok: true,
            user: userDeleted
        });

    });
});

module.exports = app;