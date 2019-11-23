"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    envelope(document) {
        return document;
    }
    envelopeAll(documents, options = {}) {
        return documents;
    }
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
                resp.json(this.envelope(document));
            }
            else {
                throw new restify_errors_1.NotFoundError(`Documento não encontrado`);
            }
            return next();
        };
    }
    renderAll(resp, next, options = {}) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                resp.json(this.envelopeAll(documents, options));
            }
            else {
                resp.json(this.envelopeAll([]));
            }
            return next();
        };
    }
}
exports.Router = Router;
