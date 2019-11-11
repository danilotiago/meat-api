"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_cpf_validator_1 = require("./../common/validators/validate-cpf.validator");
const mongoose = require("mongoose");
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
// quando User, ja define que a collection sera users
exports.User = mongoose.model('User', userSchema);
