import { User } from './../dist/users/user.model';
import { Router } from "../common/router";
import * as restify from 'restify';

class UsersRouter extends Router {
    
    applyRoutes(application: restify.Server) {
        
        application.get('/users', (req, resp, next) => {
            User.find()
                .then(users => {
                    resp.json(users);
                    return next();
                });
        });

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id)
                .then(user => {
                    if (user) {
                        resp.json(user);
                        return next();
                    }
                    resp.send(404);
                    return next();
                });
        });

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body);
            user.save().then(user => {
                user.password = undefined;

                resp.json(user);
                return next();
            });
        });

        /**
         * faz um overwrite completo, tirando os atributos
         * que nao foram passados: overwrite: true
         */
        application.put('/users/:id', (req, resp, next) => {
            User.update({_id: req.params.id}, req.body, {
                overwrite: true // substitui todo documento
            }).exec().then(result => {
                // n => numero de linhas que foram alteradas
                if (result.n) {
                    return User.findById(req.params.id);
                } else {
                    resp.send(404);
                }
            }).then(user => {
                resp.json(user);
                return next();
            });
        });

        /**
         * faz um overwrite parcial, os campos que 
         * nao forem passados serao mantidos:
         * findByIdAndUpdate()
         */
        application.patch('/users/:id', (req, resp, next) => {
            User.findByIdAndUpdate(req.params.id, req.body, {
                new: true // obtem o novo documento e nao o antigo
            })
            .then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                } else {
                    resp.send(404);
                    return next();
                }
            });
        });
    }
}

export const usersRouter = new UsersRouter();