import { User } from './../dist/users/user.model';
import { Router } from "../common/router";
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';

class UsersRouter extends Router {

    constructor() {
        super();

        /**
         * ao receber a notificacao do evento beforeRender
         * remove a senha do document para ser enviado
         * via resposta
         */
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    
    applyRoutes(application: restify.Server) {
        
        application.get('/users', (req, resp, next) => {
            User.find()
            .then(this.render(resp, next))
            .catch(next);
        });

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        });

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body);
            user.save()
            .then(this.render(resp, next))
            .catch(next);
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
                    throw new NotFoundError(`Usuário não encontrado de ID ${req.params.id}`);
                    
                }
            }).then(this.render(resp, next))
            .catch(next);
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
            .then(this.render(resp, next))
            .catch(next);
        });

        application.del('/users/:id', (req, resp, next) => {
            User.deleteOne({_id: req.params.id}).exec()
                .then((result: any) => {
                    // n => numero de linhas que foram removidas
                    if (result.n) {
                        resp.send(204);
                    } else {
                        throw new NotFoundError(`Usuário não encontrado de ID ${req.params.id}`);

                    }
                    return next();
                })
                .catch(next);
        });
    }
}

export const usersRouter = new UsersRouter();