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
    
    applyRoutes(application: restify.Server) {
        
        application.get('/users', this.findAll);

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.get('/users/:id', [this.validateId, this.findById]);

        application.post('/users', this.save);

        /**
         * substitui todo documento, se o campo nao existir, remove
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.put('/users/:id', [this.validateId, this.replace]);

        /**
         * faz o update parcial do documento, se o campo existir
         * no patch altera, se nao, mantem
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.patch('/users/:id', [this.validateId, this.update]);

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.del('/users/:id', [this.validateId, this.delete]);
    }
}

export const usersRouter = new UsersRouter();