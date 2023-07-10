const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    username: {type: String, required: true, min: 4, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    birthday: {type: Date, required: true},
    cep: {type: String, required: true},
    number: {type: String, required: true},
    complement: {type: String},
    isAdmin: {type: Boolean, default: false},
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;