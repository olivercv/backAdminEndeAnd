var express = require('express');

var mdAuthetication = require('../middlewares/authentication');

var app = express();

var Notification = require('../models/notification');


// app.get('/', (req, res, next) => {

//     res.status(200).json({
//         ok: true,
//         mensaje: 'Petición realizada correctamente'
//     });

// });


// ======================================
// Obtener todas las notificaciones
// ======================================


app.get('/', (req, res, next) => {

    var to = req.query.to || 0;
    to = Number(to);

    Notification.find({}, 'date title description image sfile type sfile order active')
        .skip(to)
        .limit(5)
        .exec(
            (err, notifications) => {
            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando notificaciones',
                    errors: err
                });
            }
        
            Notification.count({}, (err, counter) => {
                res.status(200).json({
                    ok: true,
                    notifications: notifications,
                    total: counter
                });

            });
    

        });

  
});


// ======================================
// Obtener Notificación por ID
// ======================================


app.get('/:id', (req, res) => {
    var id = req.params.id;
    Notification.findById(id)
    .exec((err, notification) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar la notificación',
                errors: err
            });
        }

        if(!notification) {
            return res.status(400).json({
                ok:false,
                message: 'La notificación con el id '+ id + ' no existe',
                errors: { message: 'No existe la notificacion con ese ID'}
            })
        }

        res.status(200).json({
            ok: true,
            notification: notification
        });
    })

})



// ======================================
// actualizar notificación
// ======================================

app.put('/:id', mdAuthetication.checkToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Notification.findById( id, (err, notification) => {
        
        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar notificación',
                errors: err
            });
        };

        if(!notification){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La notificación con el id' + id + ' no existe',
                    errors: { message: 'No existe una notificación con ese ID' }
                });
        };

        
        notification.date = body.date;
        notification.title = body.title;
        notification.description = body.description;
        notification.type = body.type;
        notification.image = body.image;
        notification.sfile = body.sfile;
        notification.order = body.order;
        notification.active = body.active;

        notification.save( (err, notificationStored) => {

            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la notificación',
                    errors: err
                });
            };


            res.status(200).json({
                ok: true,
                notification: notificationStored
            });
        });
    });

});


// ======================================
// Crear una nueva notificación
// ======================================

app.post('/', mdAuthetication.checkToken , (req, res) => {

    var body = req.body;

    var notification = new Notification({
        date: body.date,
        title: body.title,
        description: body.description,
        type: body.type,
        image: body.image,
        sfile: body.sfile,
        order: body.order,
        active: body.active
    })

    notification.save((err, notificationStored) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear la notification',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            notification: notificationStored
        });



    });

})

// ======================================
// eliminar nitificación por ID
// ======================================

app.delete('/:id', mdAuthetication.checkToken, (req, res) => {
    var id = req.params.id;

    Notification.findByIdAndRemove( id, (err, notificationDeleted) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar notificación',
                errors: err
            });
        };

        if(!notificationDeleted) { 
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una notificación para ese id',
                errors: {message: 'No existe una notificación para ese id'}
            });
        }

        res.status(201).json({
            ok: true,
            notification: notificationDeleted
        });

    });
});

module.exports = app;