"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./user.model");
const router_1 = require("../common/router");
const restify_errors_1 = require("restify-errors");
class UsersRouter extends router_1.Router {
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
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            user_model_1.User.find()
                .then(this.render(resp, next))
                .catch(next);
        });
        application.get('/users/:id', (req, resp, next) => {
            user_model_1.User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.post('/users', (req, resp, next) => {
            let user = new user_model_1.User(req.body);
            user.save()
                .then(this.render(resp, next))
                .catch(next);
        });
        /**
         * faz um overwrite completo, tirando os atributos
         * que nao foram passados: overwrite: true
         */
        application.put('/users/:id', (req, resp, next) => {
            user_model_1.User.update({ _id: req.params.id }, req.body, {
                overwrite: true // substitui todo documento
            }).exec().then(result => {
                // n => numero de linhas que foram alteradas
                if (result.n) {
                    return user_model_1.User.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError(`Usuário não encontrado de ID ${req.params.id}`);
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
            user_model_1.User.findByIdAndUpdate(req.params.id, req.body, {
                new: true // obtem o novo documento e nao o antigo
            })
                .then(this.render(resp, next))
                .catch(next);
        });
        application.del('/users/:id', (req, resp, next) => {
            user_model_1.User.deleteOne({ _id: req.params.id }).exec()
                .then((result) => {
                // n => numero de linhas que foram removidas
                if (result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError(`Usuário não encontrado de ID ${req.params.id}`);
                }
                return next();
            })
                .catch(next);
        });
    }
}
exports.usersRouter = new UsersRouter();
