const mongoose = require('../database');
const bcrytpjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false       // NÃO IRA TRAZER O CAMPO QUANDO FOR REALIZADO UM SELECT
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ANTES DE SALVAR O USARIO
UserSchema.pre('save', async function(next) {
    const hash = await bcrytpjs.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User; 