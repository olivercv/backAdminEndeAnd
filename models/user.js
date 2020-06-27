var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRols = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var userSchema = new Schema({
    name: { type:String, required: [true, 'El nombre es requerido'] },
    email: { type:String, unique:true, required: [true, 'El correo es requerido']},
    password: { type:String, required: [true, 'El password es requerido']},
    image: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRols  }
});

userSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' } )

module.exports = mongoose.model('User', userSchema );