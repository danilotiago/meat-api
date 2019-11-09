"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./../common/environment");
const restify = require("restify");
class Server {
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                // loop para inicializar as rotas
                routers.forEach(route => route.applyRoutes(this.application));
                this.application.use(restify.plugins.queryParser());
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initRoutes(routers)
            .then(() => this);
    }
}
exports.Server = Server;
