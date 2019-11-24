import { User } from './../domain/users/user.model';
import * as restify from 'restify'
import { NotAuthorizedError } from 'restify-errors';

export const authenticate: restify.RequestHandler = (req, resp, next) => {
    const {email, password} = req.body

    User.findByEmail(email, '+password') // adicionamos o campo password para ser retornado tambem (por default nao vem)
        .then(user => {
            if (user && user.matches(password)) {
                // gerar token
            } else {
                return next(new NotAuthorizedError('Invalid credentials'))
            }
        })
        .catch(next)
}