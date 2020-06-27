var express = require('express');

var mdAuthetication = require('../middlewares/authentication');

var app = express();

var Category = require('../models/category');

// ======================================
// Obtener todas las categorías
// ======================================



app.get('/', (req, res, next) => {

    var to = req.query.to || 0;
    to = Number(to);

    Category.find({}, 'name  description order active')
        .skip(to)
        .limit(5)
        .exec(
            (err, categories) => {
            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando categorias',
                    errors: err
                });
            }
        
            Category.count({}, (err, counter) => {
                res.status(200).json({
                    ok: true,
                    categories: categories,
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
    Category.findById(id)
    .exec((err, category) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar la categoria',
                errors: err
            });
        }

        if(!category) {
            return res.status(400).json({
                ok:false,
                message: 'La categoria con el id '+ id + ' no existe',
                errors: { message: 'No existe la categoria con ese ID'}
            })
        }

        res.status(200).json({
            ok: true,
            category: category
        });
    })

})


// ======================================
// actualizar categoría
// ======================================

app.put('/:id', mdAuthetication.checkToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Category.findById( id, (err, category) => {
        
        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoría',
                errors: err
            });
        };

        if(!category){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La categoría con el id' + id + ' no existe',
                    errors: { message: 'No existe una categoría con ese ID' }
                });
        };

        
       
        category.name = body.name;
        category.description = body.description;
        category.order = body.order;
        category.active = body.active;

        category.save( (err, categoryStored) => {

            if(err) { 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la categoría',
                    errors: err
                });
            };


            res.status(200).json({
                ok: true,
                category: categoryStored
            });
        });
    });

});


// ======================================
// Crear una nueva categoría
// ======================================

app.post('/', mdAuthetication.checkToken , (req, res) => {

    var body = req.body;

    var category = new Category({
        name: body.name,
        description: body.description,
        order: body.order,
        active: body.active
    })

    category.save((err, categoryStored) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear la categoría',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            category: categoryStored
        });



    });

})

// ======================================
// eliminar nitificación por ID
// ======================================

app.delete('/:id', mdAuthetication.checkToken, (req, res) => {
    var id = req.params.id;

    Category.findByIdAndRemove( id, (err, categoryDeleted) => {

        if(err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar categoría',
                errors: err
            });
        };

        if(!categoryDeleted) { 
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una categoría para ese id',
                errors: {message: 'No existe una categoría para ese id'}
            });
        }

        res.status(201).json({
            ok: true,
            category: categoryDeleted
        });

    });
});

module.exports = app;