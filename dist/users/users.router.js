"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./../dist/users/user.model");
const router_1 = require("../common/router");
class UsersRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            user_model_1.User.find()
                .then(users => {
                resp.json(users);
                return next();
            });
        });
        application.get('/users/:id', (req, resp, next) => {
            user_model_1.User.findById(req.params.id)
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
            let user = new user_model_1.User(req.body);
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
            user_model_1.User.update({ _id: req.params.id }, req.body, {
                overwrite: true // substitui todo documento
            }).exec().then(result => {
                // n => numero de linhas que foram alteradas
                if (result.n) {
                    return user_model_1.User.findById(req.params.id);
                }
                else {
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
            user_model_1.User.findByIdAndUpdate(req.params.id, req.body, {
                new: true // obtem o novo documento e nao o antigo
            })
                .then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                else {
                    resp.send(404);
                    return next();
                }
            });
        });
        application.del('/users/:id', (req, resp, next) => {
            user_model_1.User.deleteOne({ _id: req.params.id }).exec()
                .then((result) => {
                // n => numero de linhas que foram removidas
                if (result.n) {
                    resp.send(204);
                }
                else {
                    resp.send(404);
                }
                return next();
            });
        });
    }
}
exports.usersRouter = new UsersRouter();
