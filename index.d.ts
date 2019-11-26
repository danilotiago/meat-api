import { User } from './domain/users/user.model'

/**
 * 
 * adiciona a interface restify.Request o atributo do tipo user,
 * ou seja, sera feito um merge com todos os parametros default
 * de restify.Request mais os declarados abaixo
 * 
 */
declare module 'restify' {
    export interface Request {
        authenticated: User
    }
}