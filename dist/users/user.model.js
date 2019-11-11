"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./../common/environment");
const validate_cpf_validator_1 = require("./../common/validators/validate-cpf.validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validate_cpf_validator_1.validateCPF,
            msg: 'Invalid CPF ({VALUE})'
        }
    }
});
/**
 *
 * evento acionado apos a chamade do save pelo mongoose (save ou create)
 * function => definicao obrigatoria para o mongoose definir o contexto
 * do documento ou query corretamente ao uso do "this"
 *
 */
userSchema.pre('save', function (next) {
    const user = this;
    // se a senha nao foi modificada, nao faz nada
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, environment_1.environment.security.saltRounds).then(hash => {
        user.password = hash;
        return next();
    }).catch(next);
});
// quando User, ja define que a collection sera users
exports.User = mongoose.model('User', userSchema);
