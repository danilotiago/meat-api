"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = require("./../../security/auth.handler");
const user_model_1 = require("./user.model");
const model_router_1 = require("../../common/model-router");
const restify = require("restify");
const authz_handler_1 = require("../../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(user_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (!req.query.email) {
                return next();
            }
            user_model_1.User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(resp, next, {
                pageSize: this.pageSize, url: req.url
            }))
                .catch(next);
        };
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
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [authz_handler_1.authorize('admin'), this.findByEmail, this.findAll] },
            { version: '1.0.0', handler: [authz_handler_1.authorize('admin'), this.findAll] }
        ]));
        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.get(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        /**
         * substitui todo documento, se o campo nao existir, remove
         *
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        /**
         *
         * IMPLEMENTAR A ALTERACAO DO PERFIL DO PROPRIO USUARIO COM O PERFIL DE USER
         * COM MAIS UM MIDDLEWARE E VALIDANDO SE O ID DO USER LOGADO E O ID DA ROTA
         */
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        /**
         * faz o update parcial do documento, se o campo existir
         * no patch altera, se nao, mantem
         *
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        /**
        *
        * IMPLEMENTAR A ALTERACAO DO PERFIL DO PROPRIO USUARIO COM O PERFIL DE USER
        * COM MAIS UM MIDDLEWARE E VALIDANDO SE O ID DO USER LOGADO E O ID DA ROTA
        */
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
