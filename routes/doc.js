var express = require('express');

var app = express();

var Doc = require('../models/doc');

// ==========================================
// Obtener todos las adquisiciones
// ==========================================
app.get('/', (req, res, next) => {

    
    Doc.find({})
        .exec(
            (err, docs) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando doc',
                        errors: err
                    });
                }

                Doc.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        docs: docs,
                        total: conteo
                    });
                })

            });
});


app.get('/web', (req, res, next) => {

    
    Doc.find({})
        .populate('convocatory')
        .exec(
            (err, docs) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando doc',
                        errors: err
                    });
                }

                Doc.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        docs: docs,
                        total: conteo
                    });
                })

            });
});

// ==========================================
// Actualizar Doc
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doc.findById(id, (err, doc) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar doc',
                errors: err
            });
        }

        if (!doc) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El doc con el id ' + id + ' no existe',
                errors: { message: 'No existe un doc con ese ID' }
            });
        }

        
        doc.titulo = body.titulo;
        doc.convocatory = body.convocatory;
        doc.sfile = body.sfile;
        
        doc.save((err, docSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar doc',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                doc: docSaved
            });

        });

    });

});



// ==========================================
// Crear un nuevo doc
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var doc = new Doc({
        titulo: body.titulo,
        convocatory: body.convocatory
        
    });

    doc.save((err, docSaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear doc',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            doc: docSaved
        });


    });

});


// ============================================
//   Borrar un doc por el id
// ============================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Doc.findByIdAndRemove(id, (err, docDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar doc',
                errors: err
            });
        }

        if (!docDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un doc con ese id',
                errors: { message: 'No existe un doc con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            doc: docDeleted
        });

    });

});


module.exports = app;