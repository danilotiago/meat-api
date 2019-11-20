import { NotFoundError } from 'restify-errors';
import { Restaurant } from './restaurant.model';
import * as restify from 'restify';

export class RestaurantsService {

    findMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        
        /**
         * +menu => faz a projecao dizendo que queremos alem do restaurante,
         * o menu tambem, como ele foi removido da consulta padrao devemos
         * explicitar que agora tambem queremos o menu
         */
        return Restaurant.findById(req.params.id, '+menu')
            .then(restaurant => {
                if (! restaurant) {
                    throw new NotFoundError(`Restaurante de id ${req.params.id} não encontrado`);
                }
                resp.json(restaurant.menu);
                return next();
            }).catch(next)
    }

    replaceMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        return Restaurant.findById(req.params.id)
            .then(restaurant => {
                if (! restaurant) {
                    throw new NotFoundError(`Restaurante de id ${req.params.id} não encontrado`);
                }
                restaurant.menu = req.body;
                return restaurant.save();
            }).then(restaurant => { // pega o rest. atualizado do alg. acima
                resp.json(restaurant.menu);
                return next();
            }).catch(next);
    }
}