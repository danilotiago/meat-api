"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authz_handler_1 = require("./../../security/authz.handler");
const reviewsService_1 = require("./reviewsService");
const review_model_1 = require("./review.model");
const model_router_1 = require("../../common/model-router");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(review_model_1.Review);
        this.reviewsService = new reviewsService_1.ReviewsService();
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.restaurant._id || document.restaurant;
        resource._links.self = `/restaurants/${restId}`;
        return resource;
    }
    /**
     * sobreposicao da estrategia de manipulacao da query antes da inscricao
     * vamos popular os atributos user e restaurant assim como:
     * ReviewService.getByIdAndUserAndRestaurant
     *
     * @param query
     */
    prepareQueryAll(query) {
        return query
            .populate('user', 'name')
            .populate('restaurant', 'name');
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.get(`${this.basePath}/:id`, [this.validateId, this.reviewsService.getByIdAndUserAndRestaurant]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('user'), this.save]);
        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('user'), this.validateId, this.delete]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
