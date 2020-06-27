var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
    
    name: {type: String, required:[true, 'El nombre de la categoría es obligatorio']},
    description: {type: String, required:[true, 'la descripción es necesaria']},
    order: { type: Number, required: false },
    active: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Category',CategorySchema);