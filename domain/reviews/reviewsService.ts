import { Review } from './review.model';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';

export class ReviewsService {

    getByIdAndUserAndRestaurant = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        
        /**
         * obtem o user e o restaurant populados, ao inves de so a string do id
         */
        return Review.findById(req.params.id)
            .populate('user', 'name') // popula o atributo user e obtem apenas o nome
            .populate('restaurant', 'name') // popula o atributo restaurant e obtem apenas o nome
            .then(review => {
                if (! review) {
                    throw new NotFoundError(`Review de id ${req.params.id} não encontrado`);
                }
                resp.json(review);
                return next();
            }).catch(next)
    }
}