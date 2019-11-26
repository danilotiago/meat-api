import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors'

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticated && 
            req.authenticated.hasAny(...profiles)) {
                next()
        } else {
            next(new ForbiddenError('Permissão negada'))
        }
    }
}