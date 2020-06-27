var express = require('express');

var app = express();

var Publication = require('../models/publication');
var Notification = require('../models/notification');
var User = require('../models/user');
var Category = require('../models/category');
var Convocatory = require('../models/convocatory');

// ======================================
// Busqueda específica
// ======================================

app.get('/for/:collection/:term', (req, res) => {
    var param = req.params.param;
    var regex = new RegExp( param, 'i' );
    var collection = req.params.collection;
    var promise;
    switch(collection){
        case 'users':
            promise = searchUsers(param, regex);
            break;
        case 'publications':
            promise = searchPublications(param, regex);
            break;
        case 'notifications':
            promise = searchNotifications(param, regex);
            break;
        case 'categories':
            promise = searchCategories(param, regex);
            break;
        case 'convocatories':
            promise = searchConvocatories(param, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda solo son publications, notifications, categories, convocatories o users'
            });
    }

    promise.then( data => {

            res.status(200).json({
                ok: true,
                [collection]: data
            });
    });

  
});



// ======================================
// Busqueda General
// ======================================

app.get('/all/:param', (req, res, next) => {

    var param = req.params.param;
    var regex = new RegExp( param, 'i' );

    Promise.all( [
        searchPublications( param, regex ), 
        searchNotifications( param, regex),
        searchConvocatories( param, regex),
        searchUsers( param, regex)
    ])
    .then(response => {

        res.status(200).json({
            ok: true,
            publications: response[0],
            notifications: response[1],
            convocatories: response[2],
            users: response[3]
        });
    })

    // searchPublications ( param, regex )
    //     .then( publications => {

    //         res.status(200).json({
    //             ok: true,
    //             publications: publications
    //         }); 

    // });

});


function searchPublications( param, regex) {

    return new Promise( (resolve, reject) => {

        Publication.find({})
        .or([ { title: regex }, { description: regex } ])
        .populate('category', 'name description')
        .exec(( err, publications ) => {

            if( err ) {
                reject('Error al cargar publicaciones', err);
            } else {
                resolve( publications );
            }
    
        });
    })

    
}

function searchNotifications( param, regex) {

    return new Promise( (resolve, reject) => {

        Notification.find({})
        .or([ { title: regex }, { description: regex } ])
        .exec(( err, notifications ) => {

            if( err ) {
                reject('Error al cargar notificaciones', err);
            } else {
                resolve( notifications );
            }
    
        });
    })

    
}

function searchUsers( param, regex) {

    return new Promise( (resolve, reject) => {

        User.find({}, 'name email')
        .or([ { name: regex }, { email: regex } ])
        .exec( (err, users) => {
        
            if ( err ) {
                reject('Error al cargar usuarios', err);
            }else {
                resolve( users );
            }

        })
    })

    
}

function searchCategories( param, regex) {

    return new Promise( (resolve, reject) => {

        Category.find({}, 'name description')
        .or([ { name: regex }, { description: regex } ])
        .exec( (err, categories) => {
        
            if ( err ) {
                reject('Error al cargar categorías', err);
            }else {
                resolve( categories );
            }

        })
    })

    
}

function searchConvocatories( param, regex) {

    return new Promise( (resolve, reject) => {

        Convocatory.find({})
        .or([ { titulo: regex }, { correo: regex } ])
        .exec(( err, convocatories ) => {

            if( err ) {
                reject('Error al cargar convocatorias', err);
            } else {
                resolve( convocatories );
            }
    
        });
    })

    
}
    

module.exports = app;
