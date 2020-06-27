var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var convocatorySchema = new Schema({
    //section: { type: String, required: [true, 'El nombre es necesario'] },
    titulo: { type: String, required: [true, 'El Titulo es necesario'] },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    correo: { type: String, required: [true, 'El correo asociado es necesario'] },
    fecha_invitacion: { type: Date, required: [true, 'La fecha de invitacion es necesaria'] },
    fecha_presentacion: { type: Date, required: [true, 'La fecha de presentacion es necesaria'] },
    fecha_ampliacion: { type: Date},
    fecha_consultas: { type: Date }
    
    
    
    
});



module.exports = mongoose.model('Convocatory', convocatorySchema);