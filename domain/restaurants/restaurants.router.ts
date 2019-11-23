import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurant.model';
import { ModelRouter } from "../../common/model-router";
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';

class RestaurantsRouter extends ModelRouter<Restaurant> {

    restaurantService: RestaurantsService;

    constructor() {
        super(Restaurant);
        this.restaurantService = new RestaurantsService();
    }

    envelope(document: any) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    
    applyRoutes(application: restify.Server) {

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
    
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            {version: '2.0.0', handler: [this.restaurantService.finbByName, this.findAll]},
            {version: '1.0.0', handler: this.findAll}
        ]));

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

        application.post(`${this.basePath}`, this.save);

        /**
         * substitui todo documento, se o campo nao existir, remove
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);

        /**
         * faz o update parcial do documento, se o campo existir
         * no patch altera, se nao, mantem
         * 
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);

        /**
         * chama o callback de validar o ID e se tudo certo chama o metodo
         */
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);

        /**
         * chama o metodo de retorno de restaurantes
         */
        application.get(`${this.basePath}/:id/menu`, [
            this.validateId, 
            this.restaurantService.findMenu
        ]);

        /**
         * chama o metodo de atualizar menu
         */
        application.put(`${this.basePath}/:id/menu`, [
            this.validateId, 
            this.restaurantService.replaceMenu
        ]);
    }
}

export const restaurantsRouter = new RestaurantsRouter();