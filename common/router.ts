import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

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
                throw new NotFoundError(`Documento não encontrado`);
            }
            return next();
        }
    }
}