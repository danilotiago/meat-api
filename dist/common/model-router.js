"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.pageSize = 2; // valor de teste
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError(`Objeto não encontrado com o ID ${req.params.id}`));
            }
            else {
                next();
            }
        };
        this.findAll = (req, resp, next) => {
            let page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            const skip = (page - 1) * this.pageSize;
            this.model.count({}).exec()
                .then(count => {
                this.model.find()
                    .skip(skip)
                    .limit(this.pageSize)
                    .then(this.renderAll(resp, next, {
                    page, count, pageSize: this.pageSize, url: req.url
                }))
                    .catch(next);
            });
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
        this.basePath = `/${this.model.collection.name}`;
    }
    envelope(document) {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
    envelopeAll(documents, options = {}) {
        const resource = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }
            const remaining = options.count - (options.page * options.pageSize);
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
            }
        }
        return resource;
    }
    /**
     * estrategia para manipular a query nas classes filhas antes
     * de se inscrever, assim podemos customizar uma query antes
     * da inscricao
     *
     * @param query
     */
    prepareQueryAll(query) {
        return query;
    }
}
exports.ModelRouter = ModelRouter;
