import { authenticate } from './../../security/auth.handler';
import { User } from './user.model';
import { ModelRouter } from "../../common/model-router";
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);

        /**
         * ao receber a notificacao do evento beforeRender
         * remove a senha do document para ser enviado
         * via resposta
         */
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }

    findByEmail = (req, resp, next) => {
        
        if (! req.query.email) {
            return next();
        }

        User.findByEmail(req.query.email)
            .then(user => user ? [user] : [])
            .then(this.renderAll(resp, next, {
                pageSize: this.pageSize, url: req.url 
            }))
            .catch(next);
    }
    
    applyRoutes(application: restify.Server) {
        
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            {version: '2.0.0', handler: [this.findByEmail, this.findAll]},
            {version: '1.0.0', handler: [this.findAll]}
        ]));

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

        application.post(`${this.basePath}`, this.save);

        /**
         * substitui todo documento, se o campo nao existir, remove
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);

        /**
         * faz o update parcial do documento, se o campo existir
         * no patch altera, se nao, mantem
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);

        application.post(`${this.basePath}/authenticate`, authenticate);
    }
}

export const usersRouter = new UsersRouter();