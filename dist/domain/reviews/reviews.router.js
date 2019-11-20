"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviewsService_1 = require("./reviewsService");
const review_model_1 = require("./review.model");
const model_router_1 = require("../../common/model-router");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(review_model_1.Review);
        this.reviewsService = new reviewsService_1.ReviewsService();
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
        application.get('/reviews', this.findAll);
        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.get('/reviews/:id', [this.validateId, this.reviewsService.getByIdAndUserAndRestaurant]);
        application.post('/reviews', this.save);
        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.del('/reviews/:id', [this.validateId, this.delete]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
