"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_service_1 = require("./restaurants.service");
const restaurant_model_1 = require("./restaurant.model");
const model_router_1 = require("../../common/model-router");
const restify = require("restify");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurant_model_1.Restaurant);
        this.restaurantService = new restaurants_service_1.RestaurantsService();
    }
    applyRoutes(application) {
        /**
         * Exemplo com versao de endpoint:
         *
         * configurando a rota pelo objeto ao inves apenas da string '/restaurants',
         * com isso podemos passar a versao do endpoint que por default, eh a mais
         * atual
         *
         * podemos definir a versao exata passando no header:
         * accept-version: 2.0.0
         *
         * podemos passar uma versao mais atualizada de alguma versao:
         * accept-version: ~2
         * ou seja, sera usada a versao mais atualizada da versao 2
         *
         * podemos passar uma versao a partir de:
         * accept-version: >1
         * ou seja, sera buscado uma versao da 2 pra cima
         *
         * caso a versao passada nao exista, o restify dara erro
         *
         */
        application.get('/restaurants', restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [this.restaurantService.finbByName, this.findAll] },
            { version: '1.0.0', handler: this.findAll }
        ]));
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
