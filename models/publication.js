var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
    date: {type: Date, required:[true, 'la fecha es necesaria']},
    title: {type: String, required:[true, 'El título es obligatorio']},
    description: {type: String, required:[true, 'la descripción es necesaria']},
    type: { type: Number, required: true , default: 1},
    image: { type: String, required: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required:[true, 'El Id de la categoría es obligatorio'] },
    lnk: { type: String, required: false },
    order: { type: Number, required: false },
    active: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Publication',PublicationSchema);