var express = require('express');
var fileUpload = require('express-fileupload');
const path = require('path');
var fs = require('fs');


var app = express();


var User = require('../models/user');
var Publication = require('../models/publication');
var Notification = require('../models/notification');

app.use( fileUpload());

app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;

    // tipos de colecciones

    var validCollection = ['users', 'publications','notifications'];
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

    var fil = req.files.image;
    var shortName = fil.name.split('.');
    var ext = shortName[ shortName=1 ];

    // solo se aceptaran estas extensiones

    var validExt = [ 'png', 'jpg', 'gif', 'jpeg'];

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
    var path = `./uploads/${ type }/${ nameFile }`;

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

    if ( type === 'users' ) {

        User.findById( id, (err, user) => {
           
            if ( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });
            }

            if ( !user ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: { message: 'El usuario no existe' }
                });
            }

            // var oldPath = './uploads/users/' + user.image;
            var oldPath = path.resolve(__dirname, `../uploads/users/${ user.image }` );
            
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

            user.image = nameFile;

            user.save( (err, actualUser ) => {
            
            actualUser.password = ';)';

            return res.status(200).json({
                    ok: false,
                    mensaje: 'Imagen de usuario actualizada',
                    user: actualUser

                });

            });


        })


        

    };
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
                    errors: { message: 'El usuario no existe' }
                });
            }

           
            var oldPath = path.resolve(__dirname, `../uploads/publications/${ publication.image }` );
            
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

            publication.image = nameFile;

            publication.save( (err, actualPublication ) => {
            

            return res.status(200).json({
                    ok: false,
                    mensaje: 'Imagen de publicacion actualizada',
                    publication: actualPublication

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
                    mensaje: 'El usuario no existe',
                    errors: { message: 'El usuario no existe' }
                });
            }


            var oldPath = path.resolve(__dirname, `../uploads/notifications/${ notification.image }` );
            
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

            notification.image = nameFile;

            notification.save( (err, actualNotification ) => {
            

            return res.status(200).json({
                    ok: false,
                    mensaje: 'Imagen de la notificacion actualizada',
                    notification: actualNotification

                });

            });


        })


    }

}


module.exports = app;
