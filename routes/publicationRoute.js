var express = require('express');

var mdAuthetication = require('../middlewares/authentication');

var app = express();

var Publication = require('../models/publication');

// ======================================
// Obtener todas las publicaciones
// ======================================


app.get('/', (req, res, next) => {

    var to = req.query.to || 0;
    to = Number(to);

    Publication.find({}, 'date title description type image category lnk order active')
        .skip(to)
        .limit(5)
        .populate('category', 'name description')
        .exec(
            (err, publications) => {
            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando publicaciones',
                    errors: err
                });
            }

            Publication.countDocuments({}, (err, cunter) => {
                res.status(200).json({
                    ok: true,
                    publications: publications,
                    total: cunter
                });

            });
            
    

        });

  
});

// ======================================
// Obtener Publicación por ID
// ======================================


app.get('/:id', (req, res) => {
    var id = req.params.id;
    Publication.findById(id)
    .populate('category','name description order')
    .exec((err, publication) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar la publicación',
                errors: err
            });
        }

        if(!publication) {
            return res.status(400).json({
                ok:false,
                message: 'La publicación con el id '+ id + ' no existe',
                errors: { message: 'No existe la Publicacion con ese ID'}
            })
        }

        res.status(200).json({
            ok: true,
            publication: publication
        });
    })

})


// ======================================
// actualizar publicación
// ======================================

app.put('/:id', mdAuthetication.checkToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Publication.findById( id, (err, publication) => {
        
        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar publicación',
                errors: err
            });
        };

        if(!publication){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La publicación con el id' + id + ' no existe',
                    errors: { message: 'No existe una publicación con ese ID' }
                });
        };

        
        publication.date = body.date;
        publication.title = body.title;
        publication.description = body.description;
        publication.type = body.type;
        publication.image = body.image;
        publication.category = body.category;
        publication.lnk = body.lnk;
        publication.order = body.order;
        publication.active = body.active;

        publication.save( (err, publicationStored) => {

            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la publicación',
                    errors: err
                });
            };


            res.status(200).json({
                ok: true,
                publication: publicationStored
            });
        });
    });

});


// ======================================
// Crear un nuevo usuario
// ======================================

app.post('/', mdAuthetication.checkToken , (req, res) => {

    var body = req.body;

    var publication = new Publication({
        title: body.title,
        date: body.date,
        description: body.description,
        type: body.type,
        image: body.image,
        category: body.category,
        lnk: body.lnk,
        order: body.order,
        active: body.active
    })

    publication.save((err, publicationStored) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear la publicación',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            publication: publicationStored
        });



    });

})

// ======================================
// eliminarpublicación por ID
// ======================================

app.delete('/:id', mdAuthetication.checkToken, (req, res) => {
    var id = req.params.id;

    Publication.findByIdAndRemove( id, (err, publicationDeleted) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar publicación',
                errors: err
            });
        };

        if(!publicationDeleted) { 
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una publicación para ese id',
                errors: {message: 'No existe una publicación para ese id'}
            });
        }

        res.status(201).json({
            ok: true,
            publication: publicationDeleted
        });

    });
});

module.exports = app;