"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./user.model");
const model_router_1 = require("../../common/model-router");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(user_model_1.User);
        /**
         * ao receber a notificacao do evento beforeRender
         * remove a senha do document para ser enviado
         * via resposta
         */
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
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
exports.usersRouter = new UsersRouter();
