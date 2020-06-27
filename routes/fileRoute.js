var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');


app.get('/:type/:sfile', (req, res, next) => {

    var type = req.params.type;
    var sfile = req.params.sfile;

    var pathFile = path.resolve(__dirname, `../uploads/files/${ type }/${ sfile }` );

    if (fs.existsSync(pathFile)) {
        res.sendFile(pathFile);
    } else{

    	 return res.status(404).json({
                    ok: false,
                    mensaje: 'Error no se pudo encontrar el archivo',
                    errors: err
                });
        // var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg` );
        // res.sendFile(pathNoImage);
    }
    
   

});
module.exports = app;