"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    render(resp, next) {
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
            }
            else {
                throw new restify_errors_1.NotFoundError(`Documento não encontrado`);
            }
            return next();
        };
    }
    renderAll(resp, next) {
        return (documents) => {
            if (documents) {
                documents.forEach(document => {
                    this.emit('beforeRender', document);
                });
                resp.json(documents);
            }
            else {
                resp.json([]);
            }
        };
    }
}
exports.Router = Router;
