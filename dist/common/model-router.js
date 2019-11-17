"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError(`Objeto não encontrado com o ID ${req.params.id}`));
            }
            else {
                next();
            }
        };
        this.findAll = (req, resp, next) => {
            this.model.find()
                .then(this.renderAll(resp, next))
                .catch(next);
        };
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.save = (req, resp, next) => {
            let document = new this.model(req.body);
            document.save()
                .then(this.render(resp, next))
                .catch(next);
        };
        /**
         * faz um overwrite completo, tirando os atributos
         * que nao foram passados: overwrite: true
         */
        this.replace = (req, resp, next) => {
            this.model.update({ _id: req.params.id }, req.body, {
                overwrite: true,
                runValidators: true // executa as validacoes tambem no metodo update()
            }).exec().then(result => {
                // n => numero de linhas que foram alteradas
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError(`Objeto não encontrado de ID ${req.params.id}`);
                }
            }).then(this.render(resp, next))
                .catch(next);
        };
        /**
         * faz um overwrite parcial, os campos que
         * nao forem passados serao mantidos:
         * findByIdAndUpdate()
         */
        this.update = (req, resp, next) => {
            this.model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true // executa as validacoes tambem no metodo update()
            })
                .then(this.render(resp, next))
                .catch(next);
        };
        this.delete = (req, resp, next) => {
            this.model.deleteOne({ _id: req.params.id }).exec()
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
        };
    }
}
exports.ModelRouter = ModelRouter;
