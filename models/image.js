var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = Schema({
    url: {type: String, required:[true, 'La url es obligatoria']},
    thumb: {type: String, required:[true, 'La url del imagen previa es obligatoria']},
    description: {type: String, required:[true, 'la descripción es necesaria']},
    order: { type: Number, required: false },
    active: { type: Boolean, required: true, default: false }

});

module.exports = mongoose.model('Image',ImageSchema);