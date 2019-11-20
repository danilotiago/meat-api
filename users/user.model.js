"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./../common/environment");
var validate_cpf_validator_1 = require("./../common/validators/validate-cpf.validator");
var mongoose = __importStar(require("mongoose"));
var bcrypt = __importStar(require("bcrypt"));
var userSchema = new mongoose.Schema({
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
 * funcao que gera o hash da senha e atribui a o obj passado
 *
 * @param obj
 * @param next
 */
var hashPassword = function (obj, next) {
    bcrypt.hash(obj.password, environment_1.environment.security.saltRounds).then(function (hash) {
        obj.password = hash;
        return next();
    }).catch(next);
};
var saveMiddleware = function (next) {
    var user = this;
    /**
     * como aqui o contexto this é o Document, logo, devemos verificar
     * se o password foi modificado para este Documento, se nao,
     * nao faz nada
     */
    if (!user.isModified('password')) {
        return next();
    }
    hashPassword(user, next);
};
var updateMiddleware = function (next) {
    /**
     * como aqui o contexto this é a query, logo, devemos verificar
     * se o password esta no payload daquela query, se nao tiver,
     * nao faz nada
     */
    if (!this.getUpdate().password) {
        return next();
    }
    hashPassword(this.getUpdate(), next);
};
/**
 *
 * evento acionado apos a chamada do save pelo mongoose (save ou create)
 * function => definicao obrigatoria para o mongoose definir o contexto
 * do documento ou query corretamente ao uso do "this"
 * a funcao foi passada via constante
 *
 */
userSchema.pre('save', saveMiddleware);
/**
 *
 * evento acionado apos a chamada do findOneAndUpdate e findByIdAndUpdate
 * pelo mongoose.
 * function => definicao obrigatoria para o mongoose definir o contexto
 * do documento ou query corretamente ao uso do "this"
 * a funcao foi passada via constante
 *
 */
userSchema.pre('findOneAndUpdate', updateMiddleware);
/**
 *
 * evento acionado apos a chamada do update
 * pelo mongoose.
 * function => definicao obrigatoria para o mongoose definir o contexto
 * do documento ou query corretamente ao uso do "this"
 * a funcao foi passada via constante
 *
 */
userSchema.pre('update', updateMiddleware);
// quando User, ja define que a collection sera users
exports.User = mongoose.model('User', userSchema);
