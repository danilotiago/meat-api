import { environment } from '../../common/environment';
import { validateCPF } from '../../common/validators/validate-cpf.validator';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    profiles: string[],
    matches(password: string): boolean,
    hasAny(...profiles: string[]): boolean
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>;
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
    },
    profiles: {
        type: [String],
        required: false
    }
});

/**
 * vira um metodo da classe com o uso de statics
 */
userSchema.statics.findByEmail = function (email: string, projection: string) {
    return this.findOne({email: email}, projection);
}

/**
 * vira um metodo de instancia com o uso do methods,
 * nao devemos utilizar arrow functions pelo fato de travar o this
 * o mongoose deve controlar o this
 */
userSchema.methods.matches = function(password: string): boolean {
    return bcrypt.compareSync(password, this.password)
}

/**
 * vira um metodo de instancia com o uso do methods,
 * nao devemos utilizar arrow functions pelo fato de travar o this
 * o mongoose deve controlar o this
 */
userSchema.methods.hasAny = function(...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1)
}

/**
 * 
 * funcao que gera o hash da senha e atribui a o obj passado
 * 
 * @param obj 
 * @param next 
 */
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds).then(hash => {
        obj.password = hash;
        return next();
    }).catch(next);
}

const saveMiddleware = function (next) {
    const user: any = this;

    /**
     * como aqui o contexto this é o Document, logo, devemos verificar 
     * se o password foi modificado para este Documento, se nao,
     * nao faz nada
     */
    if (! user.isModified('password')) {
        return next();
    }
    hashPassword(user, next);
}

const updateMiddleware = function (next) {
    /**
     * como aqui o contexto this é a query, logo, devemos verificar 
     * se o password esta no payload daquela query, se nao tiver,
     * nao faz nada
     */
    if (! this.getUpdate().password) {
        return next();
    }
    hashPassword(this.getUpdate(), next);
}

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
export const User = mongoose.model<User, UserModel>('User', userSchema);