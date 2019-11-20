import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurant.model';
import { ModelRouter } from "../common/model-router";
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';

class RestaurantsRouter extends ModelRouter<Restaurant> {

    restaurantService: RestaurantsService;

    constructor() {
        super(Restaurant);
        this.restaurantService = new RestaurantsService();
    }
    
    applyRoutes(application: restify.Server) {
        
        application.get('/restaurants', this.findAll);

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.get('/restaurants/:id', [this.validateId, this.findById]);

        application.post('/restaurants', this.save);

        /**
         * substitui todo documento, se o campo nao existir, remove
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.put('/restaurants/:id', [this.validateId, this.replace]);

        /**
         * faz o update parcial do documento, se o campo existir
         * no patch altera, se nao, mantem
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.patch('/restaurants/:id', [this.validateId, this.update]);

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.del('/restaurants/:id', [this.validateId, this.delete]);

        /**
         * chama o metodo de retorno de restaurantes
         */
        application.get('/restaurants/:id/menu', [
            this.validateId, 
            this.restaurantService.findMenu
        ]);

        /**
         * chama o metodo de atualizar menu
         */
        application.put('/restaurants/:id/menu', [
            this.validateId, 
            this.restaurantService.replaceMenu
        ]);
    }
}

export const restaurantsRouter = new RestaurantsRouter();