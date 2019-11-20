"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = require("./review.model");
const restify_errors_1 = require("restify-errors");
class ReviewsService {
    constructor() {
        this.getByIdAndUserAndRestaurant = (req, resp, next) => {
            /**
             * obtem o user e o restaurant populados, ao inves de so a string do id
             */
            return review_model_1.Review.findById(req.params.id)
                .populate('user', 'name') // popula o atributo user e obtem apenas o nome
                .populate('restaurant', 'name') // popula o atributo restaurant e obtem apenas o nome
                .then(review => {
                if (!review) {
                    throw new restify_errors_1.NotFoundError(`Review de id ${req.params.id} não encontrado`);
                }
                resp.json(review);
                return next();
            }).catch(next);
        };
    }
}
exports.ReviewsService = ReviewsService;
