var express = require('express');
var fileUpload = require('express-fileupload');
const path = require('path');
var fs = require('fs');


var app = express();

var Publication = require('../models/publication');
var Notification = require('../models/notification');
var Doc = require('../models/doc');

app.use( fileUpload());

app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;

    // tipos de colecciones

    var validCollection = ['publications','notifications', 'docs'];
    if ( validCollection.indexOf( type ) < 0 ) {
        
        return res.status(400).json({
            ok: false,
            message: 'Tipo de coleccion no es Válida',
            errors: 'Tipo de coleccion no es Válida'
        });
    }

    if(!req.files) { 
        return res.status(400).json({
            ok: false,
            message: 'No selecciono ningun archivo',
            errors: 'Debe de seleccionar un archivo'
        });
    };

    // Obtener nombre del archivo

    var fil = req.files.sfile;
    var shortName = fil.name.split('.');
    var ext = shortName[ shortName=1 ];

    // solo se aceptaran estas extensiones

    var validExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    if ( validExt.indexOf(ext) < 0 ) {
        
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: 'Las extensiones validas son: ' + validExt.join(', ')
        });
    }


    // Nombre de archivo personalizado
    var nameFile = `${ id }-${ new Date().getMilliseconds() }.${ ext }`;

    //Mover el archivo temporal al un path
    var path = `./uploads/files/${ type }/${ nameFile }`;

    fil.mv( path, err => {

        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        uploadByType ( type, id, nameFile, res );

        // res.status(200).json({
        //     ok: false,
        //     mensaje: 'Archivo guardado con exito'
        // });
    

    });

  
});


function uploadByType ( type, id, nameFile, res ) {

   
    if ( type === 'publications' ) {

         Publication.findById( id, (err, publication) => {
           
            if ( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });
            }

            if ( !publication ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La publicacion no existe',
                    errors: { message: 'La publicacion no existe' }
                });
            }

           
            var oldPath = path.resolve(__dirname, `../uploads/files/publications/${ publication.image }` );
            
            // Si existe elimina la imagen anterior
            
            if (fs.existsSync(oldPath)) {
                // Si existe una imagen anterior la borra
                fs.unlink(oldPath, (send, err) => {
                    // return res.status(500).json({
                    //     ok: false,
                    //     mensaje: 'Error al mover archivo',
                    //     errors: err
                    // });

                    return;
                    
                });
                
            };

            publication.sfile = nameFile;

            publication.save( (err, actualPublication ) => {
            

            return res.status(200).json({
                    ok: false,
                    mensaje: 'Archivo de publicacion actualizado',
                    publication: actualPublication

                });

            });


        })
        
    };
    if ( type === 'docs' ) {

         Doc.findById( id, (err, doc) => {
           
            if ( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });
            }

            if ( !doc ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El documento no existe',
                    errors: { message: 'El documento no existe' }
                });
            }

           
            var oldPath = path.resolve(__dirname, `../uploads/files/docs/${ doc.sfile }` );
            
            // Si existe elimina la imagen anterior
            
            if (fs.existsSync(oldPath)) {
                // Si existe una imagen anterior la borra
                fs.unlink(oldPath, (send, err) => {
                    // return res.status(500).json({
                    //     ok: false,
                    //     mensaje: 'Error al mover archivo',
                    //     errors: err
                    // });

                    return;
                    
                });
                
            };

            doc.sfile = nameFile;

            doc.save( (err, actualDoc ) => {
            

            return res.status(200).json({
                    ok: false,
                    mensaje: 'Archivo de documento actualizado',
                    doc: actualDoc

                });

            });


        })
        
    };
    if ( type === 'notifications' ) {
        
        Notification.findById( id, (err, notification) => {
           
            if ( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });
            }

            if ( !notification ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La notificacion no existe',
                    errors: { message: 'La notificacion no existe' }
                });
            }


            var oldPath = path.resolve(__dirname, `../uploads/files/notifications/${ notification.sfile }` );
            
            // Si existe elimina la imagen anterior
            
            if (fs.existsSync(oldPath)) {
                // Si existe una imagen anterior la borra
                fs.unlink(oldPath, (send, err) => {
                    // return res.status(500).json({
                    //     ok: false,
                    //     mensaje: 'Error al mover archivo',
                    //     errors: err
                    // });

                    return;
                    
                });
                
            };

            notification.sfile = nameFile;

            notification.save( (err, actualNotification ) => {
            

            return res.status(200).json({
                    ok: false,
                    mensaje: 'Archivo de la notificacion actualizado',
                    notification: actualNotification

                });

            });


        })


    }

}


module.exports = app;
