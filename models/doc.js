var mongoose = require('mongoose');
const convocatory = require('./convocatory');
var Schema = mongoose.Schema;


var docSchema = new Schema({
    
    titulo: { type: String, required: [true, 'El Titulo es necesario'] },
    image: { type: String },
    sfile: { type: String },
    image_type: {type: String},
    convocatory: {
        type: Schema.Types.ObjectId, ref: 'Convocatory',
        required: [true, 'El id convocatori es un campo obligatorio ']
    }

        
});



module.exports = mongoose.model('Doc', docSchema);