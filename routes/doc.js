var express = require('express');

var app = express();

var Doc = require('../models/doc');
var Convocatory =  require('../models/convocatory');

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
app.post('/', async (req, res) => {

    var body = req.body;
    //console.log(body.convocatory);
    try {
        const doc = new Doc({
            titulo: body.titulo,
            convocatory: body.convocatory,  
        });
        
        await doc.save(async (err,newDoc)=>{
            const convocatoryRef = await Convocatory.findByIdAndUpdate(body.convocatory,{
                $push: {docs: newDoc},
            });
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al crear el documento',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                doc: newDoc
            });
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Something goes wrong",
            
          });
    }
    

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