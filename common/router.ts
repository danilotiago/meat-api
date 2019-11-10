import * as restify from 'restify';
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server);

    render(resp: restify.Response, next: restify.Next) {
        
        /**
         * retorna uma arrow function que valida a resposta
         * que sera enviada pelo send
         */
        return document => {
            if (document) {
                
                /**
                 * emite um evento para poder manipular
                 * o document antes de ele ser enviado
                 * na resposta
                 */
                this.emit('beforeRender', document);

                resp.send(document);
            } else {
                resp.send(404);
            }
            return next();
        }
    }
}