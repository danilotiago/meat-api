import { environment } from './../common/environment';
import { validateCPF } from './../common/validators/validate-cpf.validator';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

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
            validator: validateCPF,
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
    const user: any = this;

    // se a senha nao foi modificada, nao faz nada
    if (! user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, environment.security.saltRounds).then(hash => {
        user.password = hash;
        return next();
    }).catch(next);
});

// quando User, ja define que a collection sera users
export const User = mongoose.model<User>('User', userSchema);