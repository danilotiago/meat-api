"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_service_1 = require("./restaurants.service");
const restaurant_model_1 = require("./restaurant.model");
const model_router_1 = require("../../common/model-router");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurant_model_1.Restaurant);
        this.restaurantService = new restaurants_service_1.RestaurantsService();
    }
    applyRoutes(application) {
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
exports.restaurantsRouter = new RestaurantsRouter();
