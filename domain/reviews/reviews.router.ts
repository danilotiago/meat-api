import { ReviewsService } from './reviewsService';
import { Review } from './review.model';
import { ModelRouter } from "../../common/model-router";
import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';

class ReviewsRouter extends ModelRouter<Review> {

    reviewsService: ReviewsService;

    constructor() {
        super(Review);
        this.reviewsService = new ReviewsService();
    }

    /**
     * sobreposicao da estrategia de manipulacao da query antes da inscricao
     * vamos popular os atributos user e restaurant assim como:
     * ReviewService.getByIdAndUserAndRestaurant
     * 
     * @param query
     */
    protected prepareQueryAll(query: mongoose.DocumentQuery<Review[], Review>): mongoose.DocumentQuery<Review[], Review> {
        return query
            .populate('user', 'name')
            .populate('restaurant', 'name')
    }
    
    applyRoutes(application: restify.Server) {
        
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

export const reviewsRouter = new ReviewsRouter();