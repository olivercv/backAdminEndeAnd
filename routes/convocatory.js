var express = require('express');

var app = express();

var Convocatory = require('../models/convocatory');
var Doc = require('../models/doc');


// ==========================================
// Obtener todos las adquisiciones 
// ==========================================
app.get('/', (req, res, next) => {

    var to = req.query.to || 0;
    to = Number(to);
    
    Convocatory.find({})
        .skip(to)
        .limit(5)
        .exec(
            (err, convocatories) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando convocatory',
                        errors: err
                    });
                }

                Convocatory.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        convocatories: convocatories,
                        total: conteo
                    });
                })

            });
});
// ==========================================
// Obtener una adquisicion
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Convocatory.findById(id)
    .exec((err,convocatory)=>{
        if(err){
             return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando convocatory',
                        errors: err
        });
        }
        if(!convocatory){
           return res.status(400).json({
                ok: false,
                mensaje: 'El adquisicion con el id ' + id + ' no existe',
                errors: { message: 'No existe un convocatory con ese ID' }
            }); 
        }
        res.status(200).json({
            ok: true,
            convocatory: convocatory
            });
    })
})

// ==========================================
// Actualizar Convocatory
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Convocatory.findById(id, (err, convocatory) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar convocatory',
                errors: err
            });
        }

        if (!convocatory) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El adquisicion con el id ' + id + ' no existe',
                errors: { message: 'No existe un convocatory con ese ID' }
            });
        }

        convocatory.section = body.section;
        convocatory.titulo = body.titulo;
        convocatory.estado = body.estado;
        convocatory.correo = body.correo;
        convocatory.fecha_invitacion = body.fecha_invitacion;
        convocatory.fecha_presentacion = body.fecha_presentacion;
        convocatory.fecha_ampliacion = body.fecha_ampliacion;
        convocatory.fecha_consultas = body.fecha_consultas;
        
        convocatory.save((err, convocatorySaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar convocatory',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                convocatory: convocatorySaved
            });

        });

    });

});



// ==========================================
// Crear un nuevo convocatory
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var convocatory = new Convocatory({
        section: body.titulo,
        titulo: body.titulo,
        estado: body.estado,
        correo: body.correo,
        fecha_invitacion: body.fecha_invitacion,
        fecha_presentacion: body.fecha_presentacion,
        fecha_ampliacion: body.fecha_ampliacion,
        fecha_consultas: body.fecha_consultas
        
    });

    convocatory.save((err, convocatorySaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear convocatory',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            convocatory: convocatorySaved
        });


    });

});


// ============================================
//   Borrar un convocatory por el id
// ============================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Convocatory.findByIdAndRemove(id, (err, convocatoryDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar convocatory',
                errors: err
            });
        }

        if (!convocatoryDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un convocatory con ese id',
                errors: { message: 'No existe un convocatory con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            convocatory: convocatoryDeleted
        });

    });

});


module.exports = app;